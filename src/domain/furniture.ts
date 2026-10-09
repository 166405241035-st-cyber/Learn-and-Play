import { SCENE, findPath, inside, type Cell } from './navigation.js';
export type Direction = 'N' | 'E' | 'S' | 'W';
export const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];
export const FURNITURE = [
  { id: 'desk', label: 'โต๊ะ', width: 2, access: true, color: 0xb88854 },
  { id: 'chair-1', label: 'เก้าอี้ 1', width: 1, access: true, color: 0xd6ac69 },
  { id: 'chair-2', label: 'เก้าอี้ 2', width: 1, access: true, color: 0xd6ac69 },
  { id: 'shelf', label: 'ชั้นหนังสือ', width: 2, access: true, color: 0xa57a4b },
  { id: 'bench', label: 'ม้านั่ง', width: 2, access: true, color: 0xc59664 },
  { id: 'plant-1', label: 'กระถาง 1', width: 1, access: false, color: 0x568561 },
  { id: 'plant-2', label: 'กระถาง 2', width: 1, access: false, color: 0x568561 },
] as const;
export interface Placement { id: string; x: number; y: number; direction: Direction }
export function footprint(item: Placement) {
  const spec = FURNITURE.find(s => s.id === item.id);
  if (!spec) throw Error('ไม่พบของตกแต่ง');
  const vertical = item.direction === 'E' || item.direction === 'W';
  return { x: item.x, y: item.y, width: vertical ? 1 : spec.width, height: vertical ? spec.width : 1 };
}
export function frontCells(item: Placement): Cell[] {
  const r = footprint(item);
  if (item.direction === 'S') return Array.from({ length: r.width }, (_, i) => [r.x + i, r.y + r.height] as Cell);
  if (item.direction === 'N') return Array.from({ length: r.width }, (_, i) => [r.x + i, r.y - 1] as Cell);
  if (item.direction === 'E') return Array.from({ length: r.height }, (_, i) => [r.x + r.width, r.y + i] as Cell);
  return Array.from({ length: r.height }, (_, i) => [r.x - 1, r.y + i] as Cell);
}
export function validateLayout(layout: readonly Placement[], actor?: Cell): string | null {
  const seen = new Set<string>(), occupied = new Set<string>();
  const entry: Cell = [SCENE.projectFloor.reservedEntry[0]!, SCENE.projectFloor.reservedEntry[1]!];
  for (const item of layout) {
    if (!FURNITURE.some(s => s.id === item.id) || !DIRECTIONS.includes(item.direction)) return 'ไม่พบของหรือทิศที่รองรับ';
    if (seen.has(item.id)) return 'ของชิ้นเดิมวางซ้ำไม่ได้'; seen.add(item.id);
    if (!Number.isInteger(item.x) || !Number.isInteger(item.y)) return 'ตำแหน่งต้องเป็นช่องเต็ม';
    const r = footprint(item);
    for (let y = r.y; y < r.y + r.height; y++) for (let x = r.x; x < r.x + r.width; x++) {
      if (!inside(x, y, SCENE.projectFloor)) return 'ฐานของต้องอยู่ในพื้น 4×6 เมตรทั้งหมด';
      if (x === entry[0] && y === entry[1]) return 'ต้องเว้นทางเข้าช่อง (7,15)';
      if (actor && x === actor[0] && y === actor[1]) return 'ตัวละครยืนอยู่บนฐานนี้ เดินออกก่อนวาง';
      const key = `${x},${y}`;
      if (occupied.has(key)) return 'ฐานของทับกับของอีกชิ้น'; occupied.add(key);
    }
  }
  const blockers = layout.map(footprint);
  for (const item of layout) {
    if (!FURNITURE.find(s => s.id === item.id)!.access) continue;
    const fronts = frontCells(item).filter(([x, y]) => inside(x, y, SCENE.projectFloor));
    if (!findPath(entry, fronts, blockers, SCENE.projectFloor)) return `ต้องมีทางจากทางเข้าถึงด้านหน้า${FURNITURE.find(s => s.id === item.id)!.label}`;
  }
  return null;
}
export function proposedLayout(layout: readonly Placement[], candidate: Placement) {
  return [...layout.filter(item => item.id !== candidate.id), { ...candidate }];
}
