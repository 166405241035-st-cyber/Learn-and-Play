import { project, unproject } from './navigation.js';

export type ViewTurn = 0 | 1 | 2 | 3;
export type LogicalDirection = 'N' | 'E' | 'S' | 'W';
export type ScreenDirection = 'NE' | 'SE' | 'SW' | 'NW';
export const normalizeTurn = (turn: number): ViewTurn => ((turn % 4 + 4) % 4) as ViewTurn;
const rotate = (x: number, y: number, turn: ViewTurn) => {
  switch (turn) {
    case 0: return { x, y };
    case 1: return { x: -y, y: x };
    case 2: return { x: -x, y: -y };
    case 3: return { x: y, y: -x };
  }
};
export function viewProject(x: number, y: number, turn: ViewTurn) {
  const p = rotate(x - 16, y - 12, turn);
  return project(p.x, p.y);
}
export function viewUnproject(x: number, y: number, turn: ViewTurn) {
  const p = unproject(x, y);
  const logical = rotate(p.x, p.y, normalizeTurn(-turn));
  return { x: logical.x + 16, y: logical.y + 12 };
}
/** Billboards stay upright; choose a directional frame instead of spinning a PNG. */
export function screenDirection(direction: LogicalDirection, turn: ViewTurn): ScreenDirection {
  const vectors = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] } as const;
  const [x, y] = vectors[direction];
  const vector = rotate(x, y, turn);
  const p = project(vector.x, vector.y);
  return p.x > 0 ? p.y < 0 ? 'NE' : 'SE' : p.y > 0 ? 'SW' : 'NW';
}
export function furnitureViewDirection(direction: LogicalDirection, turn: ViewTurn): LogicalDirection {
  return (['N', 'E', 'S', 'W'] as const)[normalizeTurn(['N', 'E', 'S', 'W'].indexOf(direction) + turn)]!;
}
