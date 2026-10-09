import { MATERIALS, PROJECT, type MaterialId } from '../content/first-project.js';
import { quantities, type Plan, type PlanRevision } from './project.js';
export function compareChoice(plan: Plan, id: MaterialId) {
  const raw = (id === 'A' ? plan.boxesA : plan.boxesB).trim();
  const boxes = Number(raw), material = MATERIALS[id];
  if (!raw || !Number.isSafeInteger(boxes) || boxes <= 0) return null;
  const coverageCm2 = boxes * material.coverageCm2, cost = boxes * material.price;
  if (!Number.isSafeInteger(cost) || !Number.isSafeInteger(coverageCm2)) return null;
  const required = quantities();
  return { boxes, coverageCm2, cost, reserveCm2: coverageCm2 - required.areaCm2, remaining: PROJECT.budget - cost, coverageReady: coverageCm2 >= required.requiredCm2, budgetReady: cost <= PROJECT.budget };
}
export function revisionDiff(first: PlanRevision, latest: PlanRevision) {
  return (Object.keys(first.plan) as (keyof Plan)[]).filter(key => first.plan[key] !== latest.plan[key]).map(key => ({ field: key, before: first.plan[key], after: latest.plan[key] }));
}
