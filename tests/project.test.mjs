import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, activeAttempt, execute, inventory, inspectProject, estimate, blankPlan, assertSession } from '../.test-build/domain/project.js';

const buy = (id, materialId, boxes) => ({ id, type: 'buy', materialId, boxes });
const place = (id, materialId) => ({ id, type: 'place', materialId });
test('A/B both meet coverage and budget with exact box and reserve values', () => {
  assert.deepEqual(estimate('A'), { boxes: 18, cost: 3240, purchasedCm2: 270000, reserveCm2: 30000, remaining: 760 });
  assert.deepEqual(estimate('B'), { boxes: 14, cost: 3500, purchasedCm2: 280000, reserveCm2: 40000, remaining: 500 });
  for (const [material, boxes, sealed, reserve, money] of [['A', 18, 2, 30000, 760], ['B', 14, 2, 40000, 500]]) {
    const s = execute(execute(createSession(), buy('buy', material, boxes)), place('place', material));
    assert.equal(activeAttempt(s).remaining, money);
    assert.deepEqual(inventory(activeAttempt(s), material), { sealedBoxes: sealed, unusedCm2: 0, reserveCm2: reserve, placedCm2: 240000 });
    assert.equal(inspectProject(activeAttempt(s)).ready, true);
  }
});
test('A17 permits actual floor but rejects missing reserve; sealed return revokes current readiness', () => {
  let s = execute(execute(createSession(), buy('a17', 'A', 17)), place('place', 'A'));
  assert.equal(inspectProject(activeAttempt(s)).ready, false);
  s = execute(s, buy('extra', 'A', 1));
  assert.equal(inspectProject(activeAttempt(s)).ready, true);
  s = execute(s, { id: 'return', type: 'return', lotId: 'extra', boxes: 1 });
  assert.equal(activeAttempt(s).remaining, 940);
  assert.equal(inventory(activeAttempt(s), 'A').reserveCm2, 15000);
  assert.equal(inspectProject(activeAttempt(s)).ready, false);
});
test('remove/re-place conserves opened stock and does not turn it into refundable boxes', () => {
  let s = execute(execute(createSession(), buy('a', 'A', 18)), place('p', 'A'));
  s = execute(s, { id: 'remove', type: 'remove' });
  assert.deepEqual(inventory(activeAttempt(s), 'A'), { sealedBoxes: 2, unusedCm2: 240000, reserveCm2: 270000, placedCm2: 0 });
  assert.throws(() => execute(s, { id: 'over-return', type: 'return', lotId: 'a', boxes: 3 }), /ยังไม่เปิด/);
  s = execute(s, place('replace', 'A'));
  assert.equal(inventory(activeAttempt(s), 'A').sealedBoxes, 2);
  assert.equal(activeAttempt(s).remaining, 760);
});
test('failed purchases/placement/returns are atomic; command replay does not duplicate spending', () => {
  const original = createSession();
  assert.throws(() => execute(original, buy('big', 'B', 17)), /เงินไม่พอ/);
  assert.throws(() => execute(original, buy('fraction', 'A', 1.5)), /จำนวนเต็ม/);
  assert.deepEqual(original, createSession());
  const command = buy('once', 'A', 18);
  const once = execute(original, command);
  assert.equal(execute(once, command), once);
  assert.throws(() => execute(once, buy('once', 'A', 1)), /ข้อมูลต่างกัน/);
  const small = execute(original, buy('small', 'A', 1));
  const copy = structuredClone(small);
  assert.throws(() => execute(small, place('no', 'A')), /วัสดุไม่พอ/);
  assert.deepEqual(small, copy);
});
test('opening uses old unused stock across lots and preserves purchase prices on refund', () => {
  let s = execute(execute(createSession(), buy('a1', 'A', 8)), buy('a2', 'A', 10));
  s = execute(s, place('p', 'A'));
  assert.equal(activeAttempt(s).lots[0].placedCm2, 120000);
  assert.equal(activeAttempt(s).lots[1].sealedBoxes, 2);
  s = execute(s, { id: 'refund', type: 'return', lotId: 'a2', boxes: 2 });
  assert.equal(activeAttempt(s).remaining, 1120);
  s = execute(s, { id: 'remove', type: 'remove' });
  assert.throws(() => execute(s, buy('b', 'B', 14)), /เงินไม่พอ/);
  assertSession(s);
});
test('reset retains prior attempt and immutable plan revisions without transferring funds', () => {
  let s = execute(createSession(), { id: 'plan1', type: 'plan', plan: { ...blankPlan(), area: '24' } });
  s = execute(s, { id: 'plan2', type: 'plan', plan: { ...blankPlan(), area: '25' } });
  s = execute(s, buy('a', 'A', 18));
  const old = structuredClone(activeAttempt(s));
  s = execute(s, { id: 'reset', type: 'reset' });
  assert.deepEqual(s.attempts[0], old);
  assert.equal(activeAttempt(s).remaining, 4000);
  assert.equal(activeAttempt(s).plans.length, 0);
  assert.equal(s.attempts[0].plans[0].plan.area, '24');
});
test('reserves of another material cannot satisfy an active floor', () => {
  let s = execute(createSession(), buy('a', 'A', 16));
  s = execute(s, buy('b', 'B', 2));
  s = execute(s, place('p', 'A'));
  assert.equal(inspectProject(activeAttempt(s)).ready, false);
  assert.throws(() => execute(s, place('mixed', 'B')), /รื้อก่อน/);
});
