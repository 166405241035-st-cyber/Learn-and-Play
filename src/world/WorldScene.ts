import Phaser from 'phaser';
import { SCENE, findPath, inside, project, unproject, type Cell } from '../domain/navigation';
import { MATERIALS, type MaterialId } from '../content/first-project';

export type Destination = 'plan' | 'lesson' | 'shop' | 'build' | 'future';
const labels: Record<string, string> = {
  'BUILD-003': 'บทเรียน', 'BUILD-001': 'ร้าน A', 'BUILD-002': 'ร้าน B',
  'OBJ-006': 'พอร์ต (ขั้นถัดไป)', 'OBJ-005': 'งานประเมิน (ขั้นถัดไป)',
  'OBJ-004': 'ม้านั่ง', 'OBJ-001': 'วางแผน', 'OBJ-002': 'คลังวัสดุ', 'OBJ-003': 'พื้นที่ของฉัน',
};
const destinations: Record<string, Destination> = {
  'BUILD-003': 'lesson', 'BUILD-001': 'shop', 'BUILD-002': 'shop',
  'OBJ-006': 'future', 'OBJ-005': 'future', 'OBJ-001': 'plan', 'OBJ-002': 'build', 'OBJ-003': 'build',
};

export class WorldScene extends Phaser.Scene {
  private ground!: Phaser.GameObjects.Graphics;
  private actor!: Phaser.GameObjects.Graphics;
  private routeGraphics!: Phaser.GameObjects.Graphics;
  private position = { x: SCENE.playerSpawn[0]! + 0.5, y: SCENE.playerSpawn[1]! + 0.5 };
  private cell: Cell = [SCENE.playerSpawn[0]!, SCENE.playerSpawn[1]!];
  private route: Cell[] = [];
  private afterWalk: (() => void) | null = null;
  private floorMaterial: MaterialId | null = null;
  private modalOpen = false;
  private reduceMotion = false;
  private frame = 0;
  private openPanel: (destination: Destination) => void;
  private announce: (message: string) => void;

  constructor(openPanel: (destination: Destination) => void, announce: (message: string) => void) {
    super('world'); this.openPanel = openPanel; this.announce = announce;
  }
  create() {
    this.ground = this.add.graphics();
    this.routeGraphics = this.add.graphics().setDepth(1);
    this.actor = this.add.graphics().setDepth(100);
    this.drawGround();
    for (const object of SCENE.staticObjects) {
      const corners = [project(object.x, object.y), project(object.x + object.width, object.y), project(object.x + object.width, object.y + object.height), project(object.x, object.y + object.height)];
      const centre = project(object.x + object.width / 2, object.y + object.height / 2);
      const large = object.id.startsWith('BUILD');
      const tree = object.id.startsWith('ENV-003');
      const shape = this.add.graphics().setDepth(2);
      const color = tree ? 0x537a50 : large ? 0x79b7c9 : 0xcb8065;
      shape.fillStyle(color, 1).fillPoints(corners.map(p => new Phaser.Math.Vector2(p.x, p.y - (large ? 50 : 12))), true);
      shape.lineStyle(3, 0x384039, 0.65).strokePoints(corners.map(p => new Phaser.Math.Vector2(p.x, p.y)), true);
      if (tree) shape.fillStyle(0x537a50).fillCircle(centre.x, centre.y - 40, 34);
      if (labels[object.id]) {
        const label = this.add.text(centre.x, centre.y - (large ? 58 : 28), labels[object.id]!, { fontFamily: 'Noto Sans Thai, Tahoma, sans-serif', fontSize: '34px', color: '#26332a', backgroundColor: '#fff8e9', padding: { x: 10, y: 6 } }).setOrigin(0.5, 1).setDepth(3);
        label.setInteractive({ useHandCursor: true }).on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
          event.stopPropagation();
          if (this.modalOpen || !object.interactionCells.length) return;
          const destination = destinations[object.id];
          this.walkTo(object.interactionCells.map(([x, y]) => [x!, y!] as Cell), destination ? () => this.openPanel(destination) : () => this.announce('จุดพักผ่อนในฉากต้นแบบ'));
        });
      }
      for (const [x, y] of object.interactionCells) { const point = project(x + 0.5, y + 0.5); shape.fillStyle(0x315d7c).fillCircle(point.x, point.y, 7); }
    }
    const title = project(6, 18);
    this.add.text(title.x, title.y, '4 × 6 เมตร', { fontFamily: 'Noto Sans Thai, Tahoma, sans-serif', fontSize: '34px', color: '#384039' }).setOrigin(0.5).setDepth(4);
    this.fit();
    this.scale.on('resize', this.fit, this);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.modalOpen || !pointer.leftButtonDown()) return;
      const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const logical = unproject(point.x, point.y);
      const target: Cell = [Math.floor(logical.x), Math.floor(logical.y)];
      const object = SCENE.staticObjects.find(item => inside(target[0], target[1], item));
      const destination = object ? destinations[object.id] : undefined;
      if (object && object.interactionCells.length) {
        this.walkTo(object.interactionCells.map(([x, y]) => [x!, y!] as Cell), destination ? () => this.openPanel(destination) : () => this.announce('จุดพักผ่อนในฉากต้นแบบ'));
      } else this.walkTo([target]);
    });
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _objects: unknown, _dx: number, dy: number) => {
      if (!this.modalOpen) this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom * (dy > 0 ? 0.9 : 1.1), 0.12, 0.8));
    });
    this.events.once('shutdown', () => this.scale.off('resize', this.fit, this));
  }
  private fit() {
    this.cameras.main.setZoom(Math.min(this.scale.width / 3700, this.scale.height / 1900));
    this.cameras.main.centerOn(256, 880);
  }
  public resetView() { if (this.cameras.main) this.fit(); }
  public setModal(open: boolean) { this.modalOpen = open; }
  public setReducedMotion(reduced: boolean) { this.reduceMotion = reduced; }
  public setFloor(material: MaterialId | null) { this.floorMaterial = material; if (this.ground) this.drawGround(); }
  private drawGround() {
    this.ground.clear();
    for (let y = 0; y < SCENE.grid.height; y++) for (let x = 0; x < SCENE.grid.width; x++) {
      const onFloor = inside(x, y, SCENE.projectFloor);
      const onRoad = SCENE.protectedPaths.some(road => inside(x, y, road));
      const color = onFloor ? this.floorMaterial ? MATERIALS[this.floorMaterial].color : 0xe8d9b3 : onRoad ? 0xe6d7bc : (x + y) % 2 ? 0x87b286 : 0x80aa80;
      const corners = [project(x, y), project(x + 1, y), project(x + 1, y + 1), project(x, y + 1)].map(p => new Phaser.Math.Vector2(p.x, p.y));
      this.ground.fillStyle(color).fillPoints(corners, true);
      if (onFloor) this.ground.lineStyle(2, 0x7d7053, 0.7).strokePoints(corners, true);
    }
  }
  private walkTo(targets: readonly Cell[], onArrive?: () => void) {
    const inTransit = this.route.length && Math.hypot(this.position.x - this.cell[0] - 0.5, this.position.y - this.cell[1] - 0.5) > 0.001 ? this.route[0]! : null;
    const path = findPath(inTransit ?? this.cell, targets);
    if (!path) { this.announce('ไปจุดนี้ไม่ได้ ลองคลิกพื้นที่โล่งหรือจุดใช้งานสีน้ำเงิน'); return; }
    // Finish the current segment when a new destination is clicked; never snap backwards.
    this.route = inTransit ? [inTransit, ...path.slice(1)] : path.slice(1); this.afterWalk = onArrive ?? null;
    this.routeGraphics.clear().lineStyle(4, 0x315d7c, 0.6);
    const points = path.map(([x, y]) => { const p = project(x + 0.5, y + 0.5); return new Phaser.Math.Vector2(p.x, p.y); });
    if (points.length > 1) this.routeGraphics.strokePoints(points, false);
    if (!this.route.length) { const action = this.afterWalk; this.afterWalk = null; action?.(); }
  }
  update(time: number, delta: number) {
    if (!this.actor) return;
    if (!this.modalOpen && this.route.length) {
      const next = this.route[0]!;
      const tx = next[0] + 0.5, ty = next[1] + 0.5;
      const dx = tx - this.position.x, dy = ty - this.position.y;
      const distance = Math.hypot(dx, dy), step = Math.min(delta, 80) * 0.004;
      if (distance <= step) {
        this.position = { x: tx, y: ty }; this.cell = next; this.route.shift();
        if (!this.route.length) { this.routeGraphics.clear(); const action = this.afterWalk; this.afterWalk = null; action?.(); }
      } else { this.position.x += dx / distance * step; this.position.y += dy / distance * step; }
    }
    this.frame = !this.reduceMotion && this.route.length && !this.modalOpen ? Math.floor(time / 180) % 2 : 0;
    const p = project(this.position.x, this.position.y);
    const lift = this.frame ? 3 : 0;
    this.actor.clear().fillStyle(0x384039, 0.2).fillEllipse(p.x, p.y + 1, 42, 16);
    this.actor.fillStyle(0x315d7c).fillRoundedRect(p.x - 16, p.y - 44 - lift, 32, 35, 8);
    this.actor.fillStyle(0xf1c69e).fillCircle(p.x, p.y - 56 - lift, 16);
    this.actor.fillStyle(0x384039).fillEllipse(p.x - 9, p.y - 3, 14, 8).fillEllipse(p.x + 9, p.y - 3 - lift, 14, 8);
  }
}
