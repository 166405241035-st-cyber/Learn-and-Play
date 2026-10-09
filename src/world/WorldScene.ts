import Phaser from 'phaser';
import { SCENE, findPath, inside, type Cell } from '../domain/navigation';
import { viewProject, viewUnproject, normalizeTurn, screenDirection, type ViewTurn, type LogicalDirection } from '../domain/view';
import { MATERIALS, type MaterialId } from '../content/first-project';

export type Destination = 'plan' | 'lesson' | 'shop' | 'build' | 'future' | 'settings';
const labels: Record<string, string> = {
  'BUILD-003': 'ศูนย์เรียนรู้', 'BUILD-001': 'ร้านวัสดุ A', 'BUILD-002': 'ร้านวัสดุ B',
  'OBJ-006': 'พอร์ต', 'OBJ-005': 'กระดานงาน', 'OBJ-004': 'ม้านั่ง',
  'OBJ-001': 'โต๊ะวางแผน', 'OBJ-002': 'คลังวัสดุ', 'OBJ-003': 'พื้นที่ของคุณ',
};
const destinations: Record<string, Destination> = {
  'BUILD-003': 'lesson', 'BUILD-001': 'shop', 'BUILD-002': 'shop', 'OBJ-006': 'future',
  'OBJ-005': 'future', 'OBJ-001': 'plan', 'OBJ-002': 'build', 'OBJ-003': 'build',
};
export class WorldScene extends Phaser.Scene {
  private ground!: Phaser.GameObjects.Graphics;
  private actor!: Phaser.GameObjects.Graphics;
  private routeGraphics!: Phaser.GameObjects.Graphics;
  private marker!: Phaser.GameObjects.Graphics;
  private decorations: Phaser.GameObjects.GameObject[] = [];
  private position = { x: SCENE.playerSpawn[0]! + 0.5, y: SCENE.playerSpawn[1]! + 0.5 };
  private cell: Cell = [SCENE.playerSpawn[0]!, SCENE.playerSpawn[1]!];
  private route: Cell[] = [];
  private afterWalk: (() => void) | null = null;
  private facing: LogicalDirection = 'S';
  private floorMaterial: MaterialId | null = null;
  private modalOpen = false;
  private reduceMotion = false;
  private textScale = 1;
  private turn: ViewTurn = 0;
  private target: Cell | null = null;
  private openPanel: (destination: Destination) => void;
  private announce: (message: string) => void;
  private onMoved: () => void;

  constructor(openPanel: (destination: Destination) => void, announce: (message: string) => void, onMoved: () => void) {
    super('world'); this.openPanel = openPanel; this.announce = announce; this.onMoved = onMoved;
  }
  private point(x: number, y: number) { return viewProject(x, y, this.turn); }
  create() {
    this.ground = this.add.graphics().setDepth(-10000);
    this.routeGraphics = this.add.graphics().setDepth(-9999);
    this.marker = this.add.graphics().setDepth(10000);
    this.actor = this.add.graphics();
    this.redraw(); this.drawActor(0); this.follow();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.modalOpen || !pointer.leftButtonDown()) return;
      const p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const logical = viewUnproject(p.x, p.y, this.turn);
      const target: Cell = [Math.floor(logical.x), Math.floor(logical.y)];
      const object = SCENE.staticObjects.find(item => inside(target[0], target[1], item));
      if (object?.interactionCells.length) this.goTo(object.id);
      else this.walkTo([target]);
    });
    this.scale.on('resize', this.follow, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.follow, this));
  }
  private follow() {
    if (!this.actor) return;
    this.cameras.main.setZoom(0.95).startFollow(this.actor, false, this.reduceMotion ? 1 : 0.14, this.reduceMotion ? 1 : 0.14, 0, 40);
    this.cameras.main.centerOn(this.actor.x, this.actor.y - 40);
  }
  public resetView() { this.follow(); }
  public rotateView(delta: number) {
    if (!this.ground || this.modalOpen) return;
    this.turn = normalizeTurn(this.turn + delta);
    this.redraw(); this.drawActor(0); this.follow();
    this.announce(`มุมมอง ${this.turn + 1}/4 · พิกัดพื้นที่และทางเดินเดิม`);
  }
  public setModal(open: boolean) { this.modalOpen = open; }
  public setReducedMotion(reduced: boolean) { this.reduceMotion = reduced; this.follow(); }
  public setTextScale(scale: number) { this.textScale = scale; if (this.ground) this.redraw(); }
  public setFloor(material: MaterialId | null) { this.floorMaterial = material; if (this.ground) this.drawGround(); }
  public goTo(id: string) {
    if (!this.actor || this.modalOpen) return;
    if (id === 'square') { this.walkTo([[14, 13]]); return; }
    const object = SCENE.staticObjects.find(item => item.id === id);
    if (!object?.interactionCells.length) return;
    const destination = destinations[id];
    this.announce(`กำลังเดินไป ${labels[id] ?? object.label}`);
    this.walkTo(object.interactionCells.map(([x, y]) => [x!, y!] as Cell), destination ? () => this.openPanel(destination) : undefined);
  }
  private redraw() {
    this.drawGround();
    this.decorations.forEach(object => object.destroy()); this.decorations = [];
    for (const object of SCENE.staticObjects) {
      const corners = [this.point(object.x, object.y), this.point(object.x + object.width, object.y), this.point(object.x + object.width, object.y + object.height), this.point(object.x, object.y + object.height)];
      const centre = this.point(object.x + object.width / 2, object.y + object.height / 2);
      const baseY = Math.max(...corners.map(p => p.y));
      const large = object.id.startsWith('BUILD'), tree = object.id.startsWith('ENV-003');
      const height = large ? 130 : tree ? 120 : 32;
      const shape = this.add.graphics().setDepth(baseY);
      this.decorations.push(shape);
      const sorted = [...corners].sort((a, b) => a.x - b.x);
      const left = sorted[0]!, right = sorted[3]!, front = [...corners].sort((a, b) => b.y - a.y)[0]!;
      const polygon = (points: { x: number; y: number }[], color: number) => shape.fillStyle(color).fillPoints(points.map(p => new Phaser.Math.Vector2(p.x, p.y)), true);
      if (tree) {
        shape.fillStyle(0x384039, 0.12).fillEllipse(centre.x, centre.y, 92, 32);
        shape.fillStyle(0x79543b).fillRoundedRect(centre.x - 11, centre.y - 72, 22, 68, 5);
        shape.fillStyle(0x3f6d4c).fillCircle(centre.x, centre.y - 90, 46);
        shape.fillStyle(0x6b9d65).fillCircle(centre.x - 16, centre.y - 105, 32);
      } else {
        const upper = corners.map(p => ({ x: p.x, y: p.y - height }));
        polygon([left, front, { x: front.x, y: front.y - height }, { x: left.x, y: left.y - height }], large ? 0xe4c699 : 0xb88854);
        polygon([front, right, { x: right.x, y: right.y - height }, { x: front.x, y: front.y - height }], large ? 0xc3a170 : 0x8e623d);
        polygon(upper, large ? object.id === 'BUILD-003' ? 0x668d7f : 0xcc8061 : 0xd4aa70);
        shape.lineStyle(2, 0x4b513e, 0.5).strokePoints(upper.map(p => new Phaser.Math.Vector2(p.x, p.y)), true);
        if (large) shape.fillStyle(0x3b5350).fillRoundedRect(front.x - 18, front.y - 57, 36, 53, 8);
      }
      if (labels[object.id]) {
        const label = this.add.text(centre.x, centre.y - height - 12, labels[object.id]!, { fontFamily: 'Noto Sans Thai, Tahoma, sans-serif', fontSize: `${18 * this.textScale}px`, color: '#fff8e9', backgroundColor: '#304d43', padding: { x: 12, y: 7 } }).setOrigin(0.5, 1).setDepth(baseY + 1);
        this.decorations.push(label);
        label.setInteractive({ useHandCursor: true }).on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
          event.stopPropagation(); if (!this.modalOpen) this.goTo(object.id);
        });
      }
      for (const [x, y] of object.interactionCells) { const p = this.point(x! + 0.5, y! + 0.5); shape.fillStyle(0xf5da8a, 0.9).fillCircle(p.x, p.y, 7); }
    }
    this.drawRoute();
  }
  private drawGround() {
    this.ground.clear();
    for (let y = 0; y < SCENE.grid.height; y++) for (let x = 0; x < SCENE.grid.width; x++) {
      const floor = inside(x, y, SCENE.projectFloor), road = SCENE.protectedPaths.some(path => inside(x, y, path));
      const color = floor ? this.floorMaterial ? MATERIALS[this.floorMaterial].color : 0xddc69b : road ? 0xd9c7a1 : (x * 3 + y) % 3 ? 0x719876 : 0x769d78;
      const corners = [this.point(x, y), this.point(x + 1, y), this.point(x + 1, y + 1), this.point(x, y + 1)].map(p => new Phaser.Math.Vector2(p.x, p.y));
      this.ground.fillStyle(color).fillPoints(corners, true);
      if (floor) this.ground.lineStyle(2, 0x937b51, 0.55).strokePoints(corners, true);
      else if (!road && (x * 17 + y * 23) % 7 === 0) { const p = this.point(x + 0.5, y + 0.5); this.ground.lineStyle(2, 0x547f5f, 0.45).lineBetween(p.x - 7, p.y, p.x - 4, p.y - 6).lineBetween(p.x, p.y + 2, p.x + 3, p.y - 3); }
    }
  }
  private drawRoute() {
    this.routeGraphics.clear(); this.marker.clear();
    for (const [x, y] of this.route) { const p = this.point(x + 0.5, y + 0.5); this.routeGraphics.fillStyle(0xffedb6, 0.65).fillCircle(p.x, p.y, 5); }
    if (this.target && this.route.length) { const p = this.point(this.target[0] + 0.5, this.target[1] + 0.5); this.marker.lineStyle(3, 0xf6d67d).strokeEllipse(p.x, p.y, 48, 24); }
  }
  private walkTo(targets: readonly Cell[], onArrive?: () => void) {
    const inTransit = this.route.length && Math.hypot(this.position.x - this.cell[0] - 0.5, this.position.y - this.cell[1] - 0.5) > 0.001 ? this.route[0]! : null;
    const path = findPath(inTransit ?? this.cell, targets);
    if (!path) { this.announce('จุดนี้เดินเข้าไม่ได้ ลองพื้นโล่ง หรือคลิกป้ายชื่อเพื่อเดินไปด้านใช้งาน'); return; }
    this.route = inTransit ? [inTransit, ...path.slice(1)] : path.slice(1);
    this.target = path[path.length - 1]!; this.afterWalk = onArrive ?? null; this.drawRoute();
    if (!this.route.length) { const action = this.afterWalk; this.afterWalk = null; action?.(); }
  }
  private drawActor(frame: number) {
    const p = this.point(this.position.x, this.position.y);
    this.actor.setPosition(p.x, p.y).setDepth(p.y + 1).clear();
    const lift = frame ? 4 : 0, direction = screenDirection(this.facing, this.turn);
    this.actor.fillStyle(0x253d30, 0.22).fillEllipse(0, 1, 48, 18);
    this.actor.fillStyle(0x273d47).fillRoundedRect(-17, -20, 15, 20 - lift, 4).fillRoundedRect(3, -20, 15, 20 + lift, 4);
    this.actor.fillStyle(0xeac068).fillRoundedRect(-23, -60 - lift, 46, 44, 11);
    this.actor.fillStyle(0xf0cba7).fillCircle(0, -76 - lift, 20);
    this.actor.fillStyle(0x4b372d).fillEllipse(0, -88 - lift, 39, 17);
    const dx = direction.endsWith('E') ? 6 : -6;
    if (direction.startsWith('S')) this.actor.fillStyle(0x3a302c).fillCircle(dx - 4, -76 - lift, 2).fillCircle(dx + 4, -76 - lift, 2);
    else this.actor.fillStyle(0x4b372d).fillEllipse(0, -77 - lift, 36, 27);
  }
  update(time: number, delta: number) {
    if (!this.actor) return;
    if (!this.modalOpen && this.route.length) {
      const next = this.route[0]!, tx = next[0] + 0.5, ty = next[1] + 0.5;
      const dx = tx - this.position.x, dy = ty - this.position.y, distance = Math.hypot(dx, dy), step = Math.min(delta, 80) * 0.0035;
      this.facing = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'E' : 'W' : dy > 0 ? 'S' : 'N';
      if (distance <= step) {
        this.position = { x: tx, y: ty }; this.cell = next; this.route.shift(); this.drawRoute(); this.onMoved();
        if (!this.route.length) { const action = this.afterWalk; this.afterWalk = null; action?.(); }
      } else { this.position.x += dx / distance * step; this.position.y += dy / distance * step; }
    }
    this.drawActor(!this.reduceMotion && this.route.length && !this.modalOpen ? Math.floor(time / 180) % 2 : 0);
  }
}
