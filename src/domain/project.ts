import { validateLayout, proposedLayout, type Placement } from './furniture.js';
import type { Cell } from './navigation.js';
import { MATERIALS, PROJECT, type MaterialId } from '../content/first-project.js';

export interface Plan {
  goal: string; area: string; allowance: string; required: string;
  boxesA: string; costA: string; boxesB: string; costB: string;
  selected: MaterialId; reason: string;
}
export const blankPlan = (): Plan => ({ goal: 'มุมอ่านหนังสือ', area: '', allowance: '', required: '', boxesA: '', costA: '', boxesB: '', costB: '', selected: 'A', reason: '' });
export interface Lot {
  id: string; materialId: MaterialId; price: number; coverageCm2: number;
  purchasedBoxes: number; returnedBoxes: number; sealedBoxes: number;
  openedUnusedCm2: number; placedCm2: number;
}
export interface Attempt {
  id: string; taskId: string; taskVersion: string; initialBudget: number;
  remaining: number; lots: Lot[]; floorMaterial: MaterialId | null;
  plans: PlanRevision[];
  layout: Placement[]; layoutUndo: Placement[][]; layoutRedo: Placement[][];
  helpUsed: string[];
}
export interface PlanRevision {
  revision: number; plan: Plan; savedAt: string;
  context: { remaining: number; floorMaterial: MaterialId | null; layout: Placement[]; helpUsed: string[] };
}
export interface Session {
  activeIndex: number; attempts: Attempt[];
  commands: Record<string, string>;
}
export type Command =
  | { id: string; type: 'buy'; materialId: MaterialId; boxes: number }
  | { id: string; type: 'return'; lotId: string; boxes: number }
  | { id: string; type: 'place'; materialId: MaterialId }
  | { id: string; type: 'remove' }
  | { id: string; type: 'plan'; plan: Plan }
  | { id: string; type: 'reset' }
  | { id: string; type: 'furniture'; placement: Placement; actor: Cell }
  | { id: string; type: 'store'; itemId: string }
  | { id: string; type: 'undo-layout' | 'redo-layout'; actor: Cell }
  | { id: string; type: 'help'; lessonId: string };

export class ProjectError extends Error {}
function reject(message: string): never { throw new ProjectError(message); }
const positiveInteger = (value: number) => {
  if (!Number.isSafeInteger(value) || value <= 0) reject('จำนวนกล่องต้องเป็นจำนวนเต็มมากกว่า 0');
};
const newAttempt = (id: string): Attempt => ({ id, taskId: PROJECT.id, taskVersion: PROJECT.version, initialBudget: PROJECT.budget, remaining: PROJECT.budget, lots: [], floorMaterial: null, plans: [], layout: [], layoutUndo: [], layoutRedo: [], helpUsed: [] });
export const createSession = (): Session => ({ activeIndex: 0, attempts: [newAttempt('attempt-1')], commands: {} });
export const activeAttempt = (session: Session) => session.attempts[session.activeIndex]!;

export function quantities() {
  const areaCm2 = PROJECT.widthCm * PROJECT.lengthCm;
  const allowanceCm2 = areaCm2 * PROJECT.allowanceBasisPoints / 10000;
  return { areaCm2, allowanceCm2, requiredCm2: areaCm2 + allowanceCm2 };
}
export function estimate(materialId: MaterialId) {
  const material = MATERIALS[materialId];
  const { areaCm2, requiredCm2 } = quantities();
  const boxes = Math.ceil(requiredCm2 / material.coverageCm2);
  const cost = boxes * material.price;
  return { boxes, cost, purchasedCm2: boxes * material.coverageCm2, reserveCm2: boxes * material.coverageCm2 - areaCm2, remaining: PROJECT.budget - cost };
}
export function inventory(attempt: Attempt, materialId: MaterialId) {
  return attempt.lots.filter(lot => lot.materialId === materialId).reduce((sum, lot) => ({
    sealedBoxes: sum.sealedBoxes + lot.sealedBoxes,
    unusedCm2: sum.unusedCm2 + lot.openedUnusedCm2,
    reserveCm2: sum.reserveCm2 + lot.sealedBoxes * lot.coverageCm2 + lot.openedUnusedCm2,
    placedCm2: sum.placedCm2 + lot.placedCm2,
  }), { sealedBoxes: 0, unusedCm2: 0, reserveCm2: 0, placedCm2: 0 });
}
export function inspectProject(attempt: Attempt) {
  const { areaCm2, allowanceCm2 } = quantities();
  if (!attempt.floorMaterial) return { ready: false, message: 'ยังไม่ได้ปูพื้น เลือกวัสดุและปูพื้นที่จริง 24 ตารางเมตร' };
  const stock = inventory(attempt, attempt.floorMaterial);
  if (stock.placedCm2 !== areaCm2) return { ready: false, message: 'ปริมาณพื้นยังไม่ครบ' };
  if (stock.reserveCm2 < allowanceCm2) return { ready: false, message: `สำรอง ${stock.reserveCm2 / 10000} ตารางเมตร ยังไม่ถึง 2.4 — ซื้อเพิ่มหรือแก้แผนได้` };
  return { ready: true, message: 'พื้นและสำรองครบเงื่อนไขวัสดุแล้ว ทดลองจัดของและเก็บแผนฉบับใหม่ได้ การสรุปพอร์ตและประเมินยังเป็นงานถัดไป ผลนี้ยังไม่ใช่การยืนยันความรู้' };
}

export function assertSession(session: Session) {
  for (const attempt of session.attempts) {
    const layoutError = validateLayout(attempt.layout); if (layoutError) reject(layoutError);
    let spent = 0;
    for (const lot of attempt.lots) {
      for (const value of [lot.purchasedBoxes, lot.returnedBoxes, lot.sealedBoxes, lot.openedUnusedCm2, lot.placedCm2]) {
        if (!Number.isSafeInteger(value) || value < 0) reject('ข้อมูลจำนวนวัสดุไม่สมดุล');
      }
      if ((lot.purchasedBoxes - lot.returnedBoxes) * lot.coverageCm2 !== lot.sealedBoxes * lot.coverageCm2 + lot.openedUnusedCm2 + lot.placedCm2) reject('ปริมาณวัสดุไม่สมดุล');
      spent += (lot.purchasedBoxes - lot.returnedBoxes) * lot.price;
    }
    if (attempt.remaining !== attempt.initialBudget - spent || attempt.remaining < 0) reject('งบไม่สมดุล');
    const placed = attempt.lots.reduce((sum, lot) => sum + lot.placedCm2, 0);
    if (placed !== (attempt.floorMaterial ? quantities().areaCm2 : 0)) reject('พื้นที่ไม่สมดุล');
    if (attempt.lots.some(lot => lot.placedCm2 > 0 && lot.materialId !== attempt.floorMaterial)) reject('ต้นแบบใช้พื้นชนิดเดียว');
  }
}

/** Copy, validate, then return. A failed command never partially changes its input. */
export function execute(session: Session, command: Command): Session {
  if (!command.id || !Object.hasOwn({ buy: 1, return: 1, place: 1, remove: 1, plan: 1, reset: 1, furniture: 1, store: 1, 'undo-layout': 1, 'redo-layout': 1, help: 1 }, command.type)) reject('คำสั่งไม่ถูกต้อง');
  const signature = JSON.stringify(command);
  if (Object.hasOwn(session.commands, command.id)) {
    if (session.commands[command.id] !== signature) reject('รหัสคำสั่งเดิมมีข้อมูลต่างกัน');
    return session;
  }
  const next = structuredClone(session);
  const attempt = activeAttempt(next);
  switch (command.type) {
    case 'buy': {
      positiveInteger(command.boxes);
      const material = MATERIALS[command.materialId];
      if (!material) reject('ไม่พบวัสดุ');
      const cost = command.boxes * material.price;
      if (!Number.isSafeInteger(cost) || cost > attempt.remaining) reject(`เงินไม่พอ ต้องใช้ ${cost} เหรียญ มี ${attempt.remaining} เหรียญ`);
      attempt.remaining -= cost;
      attempt.lots.push({ id: command.id, materialId: command.materialId, price: material.price, coverageCm2: material.coverageCm2, purchasedBoxes: command.boxes, returnedBoxes: 0, sealedBoxes: command.boxes, openedUnusedCm2: 0, placedCm2: 0 });
      break;
    }
    case 'return': {
      positiveInteger(command.boxes);
      const lot = attempt.lots.find(item => item.id === command.lotId);
      if (!lot) reject('ไม่พบล็อตซื้อในงานปัจจุบัน');
      if (command.boxes > lot.sealedBoxes) reject(`คืนได้เฉพาะกล่องที่ยังไม่เปิด ล็อตนี้เหลือ ${lot.sealedBoxes} กล่อง`);
      lot.sealedBoxes -= command.boxes;
      lot.returnedBoxes += command.boxes;
      attempt.remaining += command.boxes * lot.price;
      break;
    }
    case 'place': {
      if (!MATERIALS[command.materialId]) reject('ไม่พบวัสดุ');
      if (attempt.floorMaterial) reject('ปูพื้นแล้ว หากต้องการเปลี่ยนวัสดุให้รื้อก่อน');
      let needed = quantities().areaCm2;
      const lots = attempt.lots.filter(lot => lot.materialId === command.materialId);
      if (inventory(attempt, command.materialId).reserveCm2 < needed) reject('วัสดุไม่พอปูพื้นที่จริง 24 ตารางเมตร');
      // Use already-open material first, then open the smallest necessary number of boxes FIFO.
      for (const lot of lots) {
        const used = Math.min(needed, lot.openedUnusedCm2);
        lot.openedUnusedCm2 -= used; lot.placedCm2 += used; needed -= used;
      }
      for (const lot of lots) {
        if (!needed) break;
        const opened = Math.min(lot.sealedBoxes, Math.ceil(needed / lot.coverageCm2));
        lot.sealedBoxes -= opened; lot.openedUnusedCm2 += opened * lot.coverageCm2;
        const used = Math.min(needed, lot.openedUnusedCm2);
        lot.openedUnusedCm2 -= used; lot.placedCm2 += used; needed -= used;
      }
      attempt.floorMaterial = command.materialId;
      break;
    }
    case 'remove': {
      if (!attempt.floorMaterial) reject('ยังไม่มีพื้นให้รื้อ');
      for (const lot of attempt.lots) { lot.openedUnusedCm2 += lot.placedCm2; lot.placedCm2 = 0; }
      attempt.floorMaterial = null;
      break;
    }
    case 'plan':
      attempt.plans.push({ revision: attempt.plans.length + 1, plan: structuredClone(command.plan), savedAt: new Date().toISOString(), context: { remaining: attempt.remaining, floorMaterial: attempt.floorMaterial, layout: structuredClone(attempt.layout), helpUsed: [...attempt.helpUsed] } });
      break;
    case 'help':
      if (!attempt.helpUsed.includes(command.lessonId)) attempt.helpUsed.push(command.lessonId);
      break;
    case 'furniture': {
      const layout = proposedLayout(attempt.layout, command.placement);
      const error = validateLayout(layout, command.actor); if (error) reject(error);
      attempt.layoutUndo.push(structuredClone(attempt.layout)); attempt.layoutRedo = []; attempt.layout = layout; break;
    }
    case 'store': {
      if (!attempt.layout.some(item => item.id === command.itemId)) reject('ของชิ้นนี้ยังไม่ได้วาง');
      attempt.layoutUndo.push(structuredClone(attempt.layout)); attempt.layoutRedo = [];
      attempt.layout = attempt.layout.filter(item => item.id !== command.itemId); break;
    }
    case 'undo-layout':
    case 'redo-layout': {
      const from = command.type === 'undo-layout' ? attempt.layoutUndo : attempt.layoutRedo;
      const to = command.type === 'undo-layout' ? attempt.layoutRedo : attempt.layoutUndo;
      const layout = from.at(-1); if (!layout) reject('ไม่มีการจัดของให้ย้อน/ทำซ้ำ');
      const error = validateLayout(layout, command.actor); if (error) reject(error);
      to.push(structuredClone(attempt.layout)); attempt.layout = from.pop()!; break;
    }
    case 'reset':
      next.attempts.push(newAttempt(`attempt-${next.attempts.length + 1}`));
      next.activeIndex = next.attempts.length - 1;
      break;
  }
  next.commands[command.id] = signature;
  assertSession(next);
  return next;
}
