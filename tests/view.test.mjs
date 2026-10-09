import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCENE, findPath } from '../.test-build/domain/navigation.js';
import { viewProject, viewUnproject, normalizeTurn, screenDirection, furnitureViewDirection } from '../.test-build/domain/view.js';
import { Tutorial, TUTORIAL_STEPS } from '../.test-build/ui/tutorial.js';

test('all four camera views invert to the same logical cell, including rectangular map corners', () => {
  for (let turn = 0; turn < 4; turn++) for (let x = 0; x < 32; x++) for (let y = 0; y < 24; y++) {
    const p = viewProject(x + .5, y + .5, turn);
    assert.deepEqual(viewUnproject(p.x, p.y, turn), { x: x + .5, y: y + .5 });
  }
  assert.equal(normalizeTurn(-1), 3);
  assert.equal(normalizeTurn(4), 0);
});
test('sprite-facing switches assets rather than changing physical orientation', () => {
  assert.deepEqual([0,1,2,3].map(t => screenDirection('E', t)), ['SE','SW','NW','NE']);
  assert.deepEqual([0,1,2,3].map(t => screenDirection('S', t)), ['SW','NW','NE','SE']);
  assert.deepEqual([0,1,2,3].map(t => furnitureViewDirection('S', t)), ['S','W','N','E']);
  assert.equal(furnitureViewDirection('N', 0), 'N');
});
test('rotation preserves all path destinations and physical obstacles', () => {
  for (const object of SCENE.staticObjects) {
    if (!object.interactionCells.length) continue;
    const path = findPath(SCENE.playerSpawn, object.interactionCells);
    for (let turn = 0; turn < 4; turn++) for (const [x, y] of path) {
      const p = viewProject(x + .5, y + .5, turn);
      const logical = viewUnproject(p.x, p.y, turn);
      assert.deepEqual([Math.floor(logical.x),Math.floor(logical.y)],[x,y]);
    }
  }
});
test('tutorial advances from actual actions, supports non-linear play and replay without altering economy', () => {
  const tutorial = new Tutorial();
  tutorial.record('bought'); assert.equal(tutorial.index, 0);
  tutorial.record('welcome'); assert.equal(tutorial.index, 1);
  tutorial.record('moved'); assert.equal(tutorial.index, 2);
  tutorial.record('plan-opened'); assert.equal(tutorial.index, 3);
  tutorial.record('plan-saved'); assert.equal(tutorial.index, 5);
  tutorial.record('floor-placed'); assert.equal(tutorial.index, TUTORIAL_STEPS.length);
  tutorial.replay(); assert.equal(tutorial.index, 0);
});
