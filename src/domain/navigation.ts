import layout from '../content/scene-layout.json' with { type: 'json' };

export const SCENE = layout;
export type Cell = readonly [number, number];
export const key = ([x, y]: Cell) => `${x},${y}`;
export const inside = (x: number, y: number, rect: { x: number; y: number; width: number; height: number }) => x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
export function walkable([x, y]: Cell) {
  return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < SCENE.grid.width && y < SCENE.grid.height && !SCENE.staticObjects.some(object => inside(x, y, object));
}
export function findPath(start: Cell, targets: readonly Cell[]): Cell[] | null {
  const goals = new Set(targets.filter(walkable).map(key));
  if (!walkable(start) || !goals.size) return null;
  const queue: Cell[] = [start];
  const parent = new Map<string, Cell | null>([[key(start), null]]);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i]!;
    if (goals.has(key(cell))) {
      const path: Cell[] = [];
      for (let current: Cell | null = cell; current; current = parent.get(key(current)) ?? null) path.unshift(current);
      return path;
    }
    for (const next of [[cell[0] + 1, cell[1]], [cell[0] - 1, cell[1]], [cell[0], cell[1] + 1], [cell[0], cell[1] - 1]] as Cell[]) {
      if (walkable(next) && !parent.has(key(next))) { parent.set(key(next), cell); queue.push(next); }
    }
  }
  return null;
}
export const project = (x: number, y: number) => ({ x: (x - y) * 64, y: (x + y) * 32 });
export const unproject = (x: number, y: number) => ({ x: (x / 64 + y / 32) / 2, y: (y / 32 - x / 64) / 2 });
