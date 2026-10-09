import { compareChoice, revisionDiff } from './domain/plan-comparison';
import { FURNITURE, DIRECTIONS, validateLayout, proposedLayout, type Placement } from './domain/furniture';
import Phaser from 'phaser';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/700.css';
import './style.css';
import { MATERIALS, LESSONS, type MaterialId } from './content/first-project';
import { activeAttempt, blankPlan, createSession, execute, estimate, inspectProject, inventory, type Command, type Plan } from './domain/project';
import { WorldScene, type Destination } from './world/WorldScene';
import { Tutorial, TUTORIAL_STEPS, type TutorialEvent } from './ui/tutorial';

const escape = (value: unknown) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const money = (value: number) => value.toLocaleString('th-TH');
const area = (cm2: number) => (cm2 / 10000).toLocaleString('th-TH', { maximumFractionDigits: 4 });
let session = createSession();
let plan = blankPlan();
let destination: Destination = 'plan';
let lessonIndex = 0;
let returnFromLesson: Destination = 'plan';
let lessonReturnField: string | null = null;
let message = '';
let planFeedback = '';
let cartMaterial: MaterialId = 'A';
let cartBoxes = '18';
let cartRevision: number | null = null;
let purchaseConfirmation = false;
let resetConfirmation = false;
let previousFocus: HTMLElement | null = null;
let textScale = '1';
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let settingsReturn: Destination | null = null;
let helpQuery = '';
let placement: Placement | null = null;
const tutorial = new Tutorial();
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <main class="game-shell" aria-label="เกม Learn-and-Play">
    <div id="world" role="img" aria-label="โลกเกมมุมเอียง คลิกเพื่อเดินและใช้สิ่งของ ใช้แถบเครื่องมือแทนได้"></div>
    <header class="game-top"><div class="game-brand"><span class="brand-mark">L<span>✦</span>P</span><div><span class="eyebrow">LEARN & PLAY</span><h1>ชุมชนการเรียนรู้</h1><span class="location">พื้นที่ของคุณ · ต้นแบบ</span></div></div><div class="top-actions"><span class="money-chip"><span aria-hidden="true">◈</span> <strong id="hud-money">4,000</strong><span>เหรียญ</span></span><button data-shell="fullscreen" id="fullscreen" aria-label="เปิดเต็มหน้าจอ"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/></svg> <span>เต็มจอ</span></button><button data-open="settings" aria-label="เปิดการตั้งค่า">⚙ <span>ตั้งค่า</span></button></div></header>
    <div class="camera-tools" aria-label="กล้อง"><button data-shell="rotate-left" aria-label="หมุนมุมมองซ้าย 90 องศา">↶</button><span id="camera-angle">มุม 1/4</span><button data-shell="rotate-right" aria-label="หมุนมุมมองขวา 90 องศา">↷</button><button data-shell="measure" aria-label="ดูขนาดพื้นที่จริง">วัด</button><button data-shell="follow" aria-label="กลับกล้องไปที่ตัวละคร">◎</button></div>
    <aside class="quest-hud"><button id="quest-toggle" aria-expanded="true" aria-controls="quest-body"><span class="eyebrow">โครงการของคุณ</span><strong>ออกแบบพื้นที่ของฉัน</strong><span class="fold-mark">−</span></button><div id="quest-body"><p class="quest-description">เปลี่ยนพื้นที่ว่าง 4×6 เมตรให้เป็นมุมที่คุณเลือก เตรียมวัสดุเผื่อ 10%</p><p id="next-action" class="next-action"></p><div id="summary"></div><div id="quest-progress"></div><button data-open="plan" class="quest-action">เปิดสมุดแผน ↗</button><p class="small">ผลวัสดุและความรู้ประเมินแยกกัน</p></div></aside>
    <section id="tutorial" class="tutorial-card" aria-label="ผู้ช่วยสอนเล่น" aria-live="polite"></section>
    <p id="world-message" role="status" class="world-toast">คลิกพื้นโล่งเพื่อเดิน กล้องจะตามตัวละคร</p>
    <nav class="toolbelt" aria-label="เครื่องมือเล่น"><button data-open="plan"><span aria-hidden="true">▤</span>สมุดแผน</button><button data-open="help"><span aria-hidden="true">▥</span>สมุดช่วย</button><button data-open="shop"><span aria-hidden="true">◈</span>ร้านวัสดุ</button><button data-open="build"><span aria-hidden="true">▦</span>ปูพื้น / คลัง</button><button data-open="future"><span aria-hidden="true">◇</span>แผนแรก–แผนแก้</button></nav>
    <div class="prototype-note">ภาพชั่วคราว · ยังไม่มีเซฟ รีเฟรชแล้วเริ่มใหม่</div>
  </main>
  <dialog id="panel" aria-labelledby="panel-title"><header class="panel-header"><div><span class="eyebrow">พื้นที่ของฉัน</span><h2 id="panel-title"></h2></div><button id="panel-settings" aria-label="ตั้งค่าระหว่างอ่าน">⚙</button><button id="close-panel" aria-label="ปิดหน้าต่าง">กลับโลก ×</button></header><div id="panel-body"></div><p id="panel-message" role="status"></p></dialog>`;
const dialog = document.querySelector<HTMLDialogElement>('#panel')!;
const body = document.querySelector<HTMLDivElement>('#panel-body')!;
const scene = new WorldScene(openPanel, announce, () => recordTutorial('moved'), cell => createCandidate(cell));
let cameraTurn = 0;
const createCandidate = (cell: readonly [number, number]) => {
  if (!placement) return;
  placement = { ...placement, x: cell[0], y: cell[1] }; scene.setPreview(placement); renderPlacementBar();
};
void document.fonts.load('400 20px "Noto Sans Thai"').catch(() => []).then(() => {
  new Phaser.Game({ type: Phaser.AUTO, parent: 'world', backgroundColor: '#719876', scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' }, scene: [scene], render: { antialias: true }, input: { keyboard: false } });
});

function announce(text: string) { const toast = document.querySelector('#world-message')!; toast.textContent = text; toast.classList.add('shown'); }
function refreshSummary() {
  const attempt = activeAttempt(session);
  document.querySelector('#summary')!.innerHTML = `<dl class="stats"><div><dt>ทดลองที่</dt><dd>${session.activeIndex + 1}</dd></div><div><dt>งบคงเหลือ</dt><dd>${money(attempt.remaining)} เหรียญ</dd></div><div><dt>ค่าใช้จ่ายสุทธิ</dt><dd>${money(attempt.initialBudget - attempt.remaining)} เหรียญ</dd></div><div><dt>พื้น</dt><dd>${attempt.floorMaterial ? `วัสดุ ${attempt.floorMaterial} · 24 ตร.ม.` : 'ยังไม่ปู'}</dd></div></dl>`;
  document.querySelector('#hud-money')!.textContent = money(attempt.remaining);
  const stages = [attempt.plans.length > 0, attempt.lots.length > 0, inspectProject(attempt).ready];
  document.querySelector('#quest-progress')!.innerHTML = '<div class="quest-stages">' + ['ร่างแผน', 'ซื้อวัสดุ', 'พื้นและสำรอง'].map((label, i) => `<span class="${stages[i] ? 'done' : ''}">${stages[i] ? '✓' : i + 1} ${label}</span>`).join('') + '</div>';
  scene.setFloor(attempt.floorMaterial); scene.setLayout(attempt.layout);
  document.querySelector('#next-action')!.textContent = !attempt.plans.length ? 'ต่อไป: วัดและร่างแผนของคุณ' : !attempt.lots.length ? 'ต่อไป: เปรียบเทียบแผนแล้วตรวจรายการซื้อ' : !inspectProject(attempt).ready ? 'ต่อไป: ปูพื้นและตรวจวัสดุสำรอง' : 'ต่อไป: ทดลองจัดของและดูแผนที่แก้';
}
function openPanel(next: Destination) {
  if (next === 'settings') settingsReturn = dialog.open ? destination : null;
  if (placement) finishPlacement();
  if (next === 'plan') recordTutorial('plan-opened');
  if (next === 'lesson') returnFromLesson = destination === 'lesson' ? 'plan' : destination;
  destination = next; message = ''; purchaseConfirmation = false; resetConfirmation = false;
  if (!dialog.open) { previousFocus = document.activeElement as HTMLElement; scene.setModal(true); dialog.showModal(); }
  renderPanel();
  dialog.querySelector<HTMLElement>('button')?.focus();
}
function closePanel() { dialog.close(); }
dialog.addEventListener('close', () => { scene.setModal(false); previousFocus?.focus(); });
document.querySelector('#close-panel')!.addEventListener('click', closePanel);
document.querySelector('#panel-settings')!.addEventListener('click', () => openPanel('settings'));
document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.open as Destination)));
document.querySelector('#quest-toggle')!.addEventListener('click', () => {
  const button = document.querySelector('#quest-toggle')!;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  (document.querySelector('#quest-body') as HTMLElement).hidden = expanded;
  button.querySelector('.fold-mark')!.textContent = expanded ? '+' : '−';
});
app.addEventListener('click', event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-shell]');
  if (!button) return;
  switch (button.dataset.shell) {
    case 'rotate-left': scene.rotateView(-1); cameraTurn = (cameraTurn + 3) % 4; break;
    case 'rotate-right': scene.rotateView(1); cameraTurn = (cameraTurn + 1) % 4; break;
    case 'follow': scene.resetView(); break;
    case 'measure': scene.measureFloor(); break;
    case 'placement-rotate': if (placement) { placement.direction = DIRECTIONS[(DIRECTIONS.indexOf(placement.direction)+1)%4]!; scene.setPreview(placement); renderPlacementBar(); } break;
    case 'placement-cancel': finishPlacement(); break;
    case 'placement-confirm':
      if (placement && dispatch({ type: 'furniture', placement, actor: scene.getCell() }, 'จัดของแล้ว เงินและวัสดุไม่เปลี่ยน')) { finishPlacement(); announce(message); }
      else announce(message); break;
    case 'tutorial-skip-step': tutorial.skipCurrent(); renderTutorial(); break;
    case 'fullscreen':
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => announce('ออกจากเต็มจอไม่สำเร็จ ลองกด Escape'));
      else if (app.requestFullscreen) void app.requestFullscreen().catch(() => announce('เปิดเต็มจอไม่ได้ในเบราว์เซอร์นี้ ลองใช้ F11'));
      else announce('เบราว์เซอร์นี้ไม่รองรับเต็มจอ ลองใช้ F11');
      break;
    case 'tutorial-hide': tutorial.visible = false; renderTutorial(); break;
    case 'tutorial-replay': closePanel(); tutorial.replay(); renderTutorial(); break;
    case 'tutorial-action': {
      const step = TUTORIAL_STEPS[tutorial.index];
      switch (step?.event) {
        case 'welcome': recordTutorial('welcome'); break;
        case 'moved': scene.goTo('square'); break;
        case 'plan-opened': scene.goTo('OBJ-001'); break;
        case 'plan-saved': openPanel('plan'); break;
        case 'lesson-returned': openPanel('help'); break;
        case 'purchase-reviewed': case 'bought': openPanel('shop'); break;
        case 'floor-placed': openPanel('build'); break;
        default: tutorial.visible = false; renderTutorial();
      }
      break;
    }
  }
  document.querySelector('#camera-angle')!.textContent = `มุม ${cameraTurn + 1}/4`;
});
document.addEventListener('fullscreenchange', () => {
  const active = !!document.fullscreenElement;
  const button = document.querySelector('#fullscreen')!;
  button.setAttribute('aria-label', active ? 'ออกจากเต็มหน้าจอ' : 'เปิดเต็มหน้าจอ');
  button.querySelector('span')!.textContent = active ? 'ออกเต็มจอ' : 'เต็มจอ';
});
function recordTutorial(event: TutorialEvent) {
  const previous = tutorial.index; tutorial.record(event);
  if (tutorial.index !== previous) renderTutorial();
}
function renderTutorial() {
  const element = document.querySelector<HTMLElement>('#tutorial')!;
  element.hidden = !tutorial.visible;
  if (!tutorial.visible) return;
  const index = tutorial.index, step = TUTORIAL_STEPS[index];
  element.innerHTML = `<div class="guide-avatar" aria-hidden="true">✦</div><div class="guide-content"><span class="eyebrow">ผู้ช่วยชุมชน · ${Math.min(index + 1, TUTORIAL_STEPS.length)}/${TUTORIAL_STEPS.length}</span><h2>${step?.title ?? 'พร้อมลองสร้างด้วยตัวเองแล้ว'}</h2><p>${step?.text ?? 'คุณลองใช้เครื่องมือหลักแล้ว กลับไปแก้แผน คืนวัสดุ หรือเริ่มทดลองใหม่ได้ ลองจัดของฟรี 7 ชิ้น เปิดสมุดช่วยหรือเทียบแผนเก่าได้ ประเมิน พอร์ตเต็มรูปแบบ และเซฟยังเป็นงานถัดไป'}</p><div class="guide-actions"><button data-shell="tutorial-action">${step?.action ?? 'เล่นต่อ'}</button>${step ? '<button class="guide-skip" data-shell="tutorial-skip-step">ข้ามขั้นนี้</button>' : ''}<button class="guide-skip" data-shell="tutorial-hide">${step ? 'เล่นเอง / ซ่อน' : 'ปิด'}</button></div></div>`;
}
function settingsMarkup() {
  return `<div class="settings-sheet">${settingsReturn ? '<button data-action="back-settings">กลับหน้าที่อ่านอยู่</button>' : ''}<p class="reading-sample">ตัวอย่างข้อความ: วัดพื้นที่ เลือกวัสดุ ตรวจงบ แล้วอธิบายเหตุผล</p><button data-action="reset-reading" class="secondary">คืนค่าการอ่านและการเคลื่อนไหว</button><h3>การอ่านและการเคลื่อนไหว</h3><label>ขนาดข้อความในเกม<select id="text-scale"><option value="1"${textScale === '1' ? ' selected' : ''}>100%</option><option value="1.25"${textScale === '1.25' ? ' selected' : ''}>125%</option><option value="1.5"${textScale === '1.5' ? ' selected' : ''}>150%</option></select></label><label class="check-label"><input type="checkbox" id="reduce-motion"${reducedMotion ? ' checked' : ''}> ลดการเคลื่อนไหวเสริมและการหน่วงกล้อง</label><p>ตัวละครยังเดินไปจุดหมายได้ แต่หยุดท่าเดินสลับเฟรมและให้กล้องติดตามตรง ๆ การหมุนและเปิดหน้าเปลี่ยนทันที ไม่มีแอนิเมชันบังคับ</p><h3>วิธีเล่น</h3><p>คลิกพื้นเพื่อเดิน คลิกชื่ออาคารหรือสิ่งของเพื่อเดินไปใช้ กด ↶ / ↷ เปลี่ยนมุมมองทีละ 90° กด ◎ กลับกล้องที่ตัวละคร</p><p>ใช้สมุดแผน บทเรียน ร้าน และคลังจากแถบด้านล่างได้ด้วย Escape ปิดหน้าที่เปิดอยู่</p><button data-shell="tutorial-replay">เริ่มสอนเล่นอีกครั้ง</button><h3>การแสดงผล</h3><button data-shell="fullscreen">สลับเต็มหน้าจอ</button><p class="small">ค่าตั้งและบทสอนเล่นอยู่ในรอบเปิดหน้านี้ ยังไม่มีเซฟถาวร</p></div>`;
}

function field(name: keyof Plan, label: string, unit: string, lesson: number) {
  return `<label>${label} <span class="small">(${unit})</span><input name="${name}" value="${escape(plan[name])}" inputmode="decimal" autocomplete="off"></label><button class="link-button" type="button" data-action="lesson" data-lesson="${lesson}" data-return-field="${name}">เรียนตรงขั้นนี้</button>`;
}
function comparisonMarkup() {
  return `<section class="comparison"><h3>เปรียบเทียบทางเลือกจากจำนวนที่คุณกรอก</h3><p class="small">คำนวณผลของแผนเพื่อฝึก ไม่เติมจำนวนกล่องให้ งบในตารางคือก่อนเริ่มซื้อ 4,000 เหรียญ เงินจริงแสดงแยกด้านบน</p><div class="comparison-cards">${(['A','B'] as MaterialId[]).map(id => {
    const c = compareChoice(plan,id);
    return `<article><h4>วัสดุ ${id}${plan.selected === id ? ' · เลือกอยู่' : ''}</h4>${c ? `<dl class="stats"><div><dt>จำนวน</dt><dd>${c.boxes} กล่อง</dd></div><div><dt>พื้นที่ซื้อ</dt><dd>${area(c.coverageCm2)} ตร.ม.</dd></div><div><dt>ค่าสินค้า</dt><dd>${money(c.cost)} เหรียญ</dd></div><div><dt>เหลือหลังปู 24 ตร.ม.</dt><dd>${area(c.reserveCm2)} ตร.ม.</dd></div><div><dt>งบจะเหลือ</dt><dd>${money(c.remaining)} เหรียญ</dd></div></dl><p>${c.coverageReady ? '✓ ปริมาณและสำรองพอ' : 'ต้องทบทวน: ปริมาณรวมยังไม่พอ'} · ${c.budgetReady ? '✓ อยู่ในงบ' : 'ต้องทบทวน: เกินงบ'}</p>` : '<p>กรอกจำนวนกล่องเต็มบวกของวัสดุนี้ก่อน จึงเห็นผลของแผน</p>'}</article>`;
  }).join('')}</div><p>ทั้งสองวัสดุเลือกได้เมื่อเงื่อนไขผ่าน เหตุผลเลือกยังต้องเขียนเอง ไม่สมมติคุณภาพที่โจทย์ไม่ได้ให้</p></section>`;
}
function planMarkup() {
  const attempt = activeAttempt(session);
  return `<div class="two-columns"><section class="plan-context"><h3>แปลนมุมบน</h3><div class="plan-grid" aria-label="พื้น 4 คอลัมน์ 6 แถว">${Array.from({ length: 24 }, (_, i) => `<span>${i + 1}</span>`).join('')}</div><p>กว้าง 4 เมตร · ยาว 6 เมตร<br>1 ช่อง = 1 ตารางเมตร</p><table><caption>ข้อมูลวัสดุที่ให้</caption><thead><tr><th>วัสดุ</th><th>ต่อกล่อง</th><th>ราคา</th></tr></thead><tbody><tr><td>A</td><td>1.5 ตร.ม.</td><td>180 เหรียญ</td></tr><tr><td>B</td><td>2 ตร.ม.</td><td>250 เหรียญ</td></tr></tbody></table><p>ส่วนเผื่อ 10% ของพื้นที่จริง<br>งบเริ่มต้น 4,000 เหรียญ<br>เงินจริงขณะนี้ ${money(attempt.remaining)} เหรียญ</p><p class="small">แผนเป็นการคาดการณ์ก่อนซื้อ การส่งไปตะกร้ายังไม่หักเงิน</p></section>
  <form id="plan-form"><label>เป้าหมาย<select name="goal">${['มุมอ่านหนังสือ', 'ร้านเล็ก', 'พื้นที่พักผ่อน'].map(goal => `<option${plan.goal === goal ? ' selected' : ''}>${goal}</option>`).join('')}</select></label><h3>1 · ข้อมูลและหลักการ</h3><p>เราต้องเตรียมวัสดุให้พอปูพื้นจริงและเหลือสำรองตามเงื่อนไข</p>${field('area', 'พื้นที่จริง = กว้าง × ยาว', 'ตารางเมตร', 1)}<h3>2 · ส่วนเผื่อและปริมาณรวม</h3>${field('allowance', 'ส่วนเผื่อ = พื้นที่จริง × 10 ÷ 100', 'ตารางเมตร', 2)}${field('required', 'ที่ต้องเตรียม = พื้นที่จริง + ส่วนเผื่อ', 'ตารางเมตร', 2)}<h3>3 · จำนวนกล่องและค่าสินค้า</h3><p>หารด้วยความจุต่อกล่อง แล้วปัดขึ้นเป็นกล่องเต็ม</p>${field('boxesA', 'จำนวนกล่อง A', 'กล่อง', 3)}${field('costA', 'ค่าสินค้า A = กล่อง × ราคา', 'เหรียญ', 4)}${field('boxesB', 'จำนวนกล่อง B', 'กล่อง', 3)}${field('costB', 'ค่าสินค้า B = กล่อง × ราคา', 'เหรียญ', 4)}<div id="plan-comparison">${comparisonMarkup()}</div><h3>4 · ตรวจ และ 5 · ตัดสินใจ</h3><label>วัสดุที่เลือก<select name="selected"><option value="A"${plan.selected === 'A' ? ' selected' : ''}>A</option><option value="B"${plan.selected === 'B' ? ' selected' : ''}>B</option></select></label><label>เหตุผลเลือกและวิธีตรวจ<textarea name="reason" rows="4" placeholder="อธิบายว่าพอพื้นที่และส่วนเผื่ออย่างไร งบเหลือเท่าไร และตอบเป้าหมายอย่างไร">${escape(plan.reason)}</textarea></label><div class="actions"><button type="button" data-action="check-plan">ตรวจตัวเลขเพื่อฝึก</button><button type="submit">เก็บฉบับแผน</button><button type="button" data-action="use-plan">ส่งแผนไปตะกร้า</button></div><div class="feedback">${planFeedback}</div><p class="small">แผนที่เก็บ ${attempt.plans.length} ฉบับ · เก็บในหน่วยความจำของหน้านี้เท่านั้น · เหตุผลยังไม่มีผู้ตรวจ</p></form></div>`;
}
function lessonMarkup() {
  const lesson = LESSONS[lessonIndex]!;
  return `<div class="lesson-layout"><nav aria-label="บทเรียน">${LESSONS.map((item, i) => `<button data-action="lesson" data-lesson="${i}"${i === lessonIndex ? ' aria-current="page" class="selected"' : ''}>${i + 1} · ${item.title}</button>`).join('')}</nav><article><h3>${lesson.title}</h3><p>${lesson.text}</p><div class="worked-example"><strong>ตัวอย่างและการตรวจ</strong><p>${lesson.example}</p></div><p>กลับไปลองคำนวณและเขียนเหตุผลด้วยข้อมูลในแผน ร่างเดิมยังอยู่</p><button data-action="back-lesson">กลับ${returnFromLesson === 'plan' ? 'ร่างแผน' : returnFromLesson === 'help' ? 'สมุดช่วย' : 'หน้าก่อนหน้า'}</button><p class="small">นี่คือบทเรียนฝึก การบันทึกความช่วยในงานประเมินจะทำในขั้นถัดไป</p></article></div>`;
}
function shopMarkup() {
  const attempt = activeAttempt(session);
  return `<p>ซื้อเป็นกล่องเต็ม ไม่มีหนี้ คืนได้เฉพาะกล่องที่ยังไม่เปิดตามราคาตอนซื้อ</p><table><thead><tr><th>วัสดุ</th><th>ความจุ/กล่อง</th><th>ราคา/กล่อง</th></tr></thead><tbody>${Object.values(MATERIALS).map(m => `<tr><td>${m.label}</td><td>${area(m.coverageCm2)} ตร.ม.</td><td>${m.price} เหรียญ</td></tr>`).join('')}</tbody></table><p><strong>เงินจริงเหลือ ${money(attempt.remaining)} เหรียญ</strong>${cartRevision ? ` · ตะกร้าจากแผนฉบับ ${cartRevision}` : ' · ตะกร้าเลือกเอง'}</p><form id="shop-form"><div class="two-columns"><label>วัสดุ<select id="cart-material"><option value="A"${cartMaterial === 'A' ? ' selected' : ''}>A</option><option value="B"${cartMaterial === 'B' ? ' selected' : ''}>B</option></select></label><label>จำนวนกล่อง<input id="cart-boxes" type="number" min="1" step="1" value="${escape(cartBoxes)}"></label></div><p id="cart-total"></p><button type="submit">ตรวจรายการก่อนซื้อ</button></form>${purchaseConfirmation ? `<div class="confirmation"><h3>ยืนยันซื้อ ${escape(cartBoxes)} กล่อง วัสดุ ${cartMaterial}</h3><p>จ่าย ${money(Number(cartBoxes) * MATERIALS[cartMaterial].price)} เหรียญ กล่องที่เปิดแล้วคืนเงินไม่ได้</p><button data-action="confirm-buy">ยืนยันและหักเงิน</button> <button class="secondary" data-action="cancel-buy">กลับแก้รายการ</button></div>` : ''}<div class="actions"><button class="secondary" data-action="go-build">ดูคลังและปูพื้น</button><button class="link-button" data-action="lesson" data-lesson="4">เรียนเรื่องงบ</button></div>`;
}
function historyMarkup() {
  const labels: Record<keyof Plan,string> = {goal:'เป้าหมาย',area:'พื้นที่',allowance:'ส่วนเผื่อ',required:'ที่ต้องเตรียม',boxesA:'กล่อง A',costA:'ราคา A',boxesB:'กล่อง B',costB:'ราคา B',selected:'วัสดุที่เลือก',reason:'เหตุผล'};
  return `<p>เตรียมหลักฐาน E6: แผนแรก–แผนแก้และบริบทขณะเก็บ ยังไม่ใช่พอร์ตหรือผลประเมิน เก็บเฉพาะแท็บนี้</p>${session.attempts.map((a,i)=>{
    const first=a.plans[0], latest=a.plans.at(-1);
    return `<section class="revision-card"><h3>ทดลอง ${i+1} · ${a.plans.length} ฉบับ</h3>${first && latest ? `<p>ฉบับแรก ${first.revision} → ล่าสุด ${latest.revision}</p><div class="table-scroll"><table><thead><tr><th>รายการที่เปลี่ยน</th><th>แผนแรก</th><th>ล่าสุด</th></tr></thead><tbody>${revisionDiff(first,latest).map(d=>`<tr><td>${labels[d.field]}</td><td>${escape(d.before||'ยังไม่กรอก')}</td><td>${escape(d.after||'ยังไม่กรอก')}</td></tr>`).join('')||'<tr><td colspan="3">ยังไม่มีค่าที่ต่างจากฉบับแรก</td></tr>'}</tbody></table></div><p>งบ ณ ตอนเก็บ: ${money(first.context.remaining)} → ${money(latest.context.remaining)} · ของที่วาง ${first.context.layout.length} → ${latest.context.layout.length}</p><p class="small">บทฝึกที่เปิดก่อนเก็บล่าสุด: ${latest.context.helpUsed.map(escape).join(', ')||'ยังไม่มีบันทึก'} · เหตุผลยังไม่มีผู้ตรวจ</p><details><summary>ดูทุกฉบับ</summary>${a.plans.map(r=>`<p>ฉบับ ${r.revision} · ${escape(r.plan.goal)} · ${escape(r.plan.reason||'ยังไม่เขียนเหตุผล')}<br><span class="small">${escape(r.savedAt)} · เงิน ${money(r.context.remaining)}</span></p>`).join('')}</details>`:'<p>เก็บฉบับแผนจากสมุดก่อน จึงเริ่มเทียบได้</p>'}</section>`;
  }).join('')}`;
}
const helpTopics = [
  { title:'วัดพื้นที่จากอะไร', lesson:1, keywords:'พื้นที่ กว้าง ยาว วัด หน่วย' },
  { title:'ส่วนเผื่อคิดจากอะไร', lesson:2, keywords:'ร้อยละ เผื่อ สำรอง เปอร์เซ็นต์' },
  { title:'ทำไมต้องปัดขึ้นเป็นกล่องเต็ม', lesson:3, keywords:'กล่อง หาร ทศนิยม ปัดขึ้น ไม่พอ' },
  { title:'เงินไม่พอหรือเปรียบเทียบ A/B', lesson:4, keywords:'ราคา งบ เงิน ซื้อ เปรียบเทียบ' },
  { title:'ปู รื้อ และคืนกล่อง ต่างกันอย่างไร', lesson:5, keywords:'คืน รื้อ เปิด คลัง วัสดุ ซื้อผิด' },
  { title:'ตรวจแล้วต้องแก้ตรงไหน', lesson:6, keywords:'ตรวจ แก้ ไม่พอ สำรอง' },
];
function helpResults() {
  const q=helpQuery.trim().toLocaleLowerCase('th');
  const matches=helpTopics.filter(t=>(t.title+' '+t.keywords).includes(q));
  return matches.length ? matches.map(t=>`<button data-action="lesson" data-lesson="${t.lesson}">${t.title}<span class="small">เปิดบทตรงปัญหา แล้วกลับมาสมุดช่วยได้</span></button>`).join('') : '<p>ไม่พบหัวข้อนี้ ลองคำว่า กล่อง เงิน คืน หรือพื้นที่</p>';
}
function helpMarkup() {
  return `<label>ค้นปัญหาที่กำลังติด<input id="help-search" type="search" value="${escape(helpQuery)}" placeholder="เช่น กล่อง เงิน คืน พื้นที่"></label><div id="help-results" class="help-results" aria-live="polite">${helpResults()}</div><details><summary>รายการสอนเล่น</summary>${TUTORIAL_STEPS.map((s,i)=>`<p>${i+1} · ${s.title}<br><span class="small">${s.text}</span></p>`).join('')}<button data-shell="tutorial-replay">เริ่มสอนเล่นใหม่</button></details><div class="actions"><button data-action="go-plan">กลับร่างแผน</button><button data-open-lesson="all" data-action="lesson" data-lesson="0">ดูบทเรียนทั้งหมด</button></div><p class="small">เปิดบทฝึกบันทึกไว้กับการทดลอง ไม่ใช่ผลประเมินหรือการยืนยันความรู้</p>`;
}
function finishPlacement() { placement=null; scene.setPreview(null); document.querySelector('#placement-bar')?.remove(); scene.resetView(); }
function renderPlacementBar() {
  if (!placement) return;
  let bar=document.querySelector<HTMLElement>('#placement-bar');
  if (!bar) { bar=document.createElement('section'); bar.id='placement-bar'; bar.setAttribute('aria-label','จัดของในโลก'); document.querySelector('.game-shell')!.append(bar); }
  const error=validateLayout(proposedLayout(activeAttempt(session).layout,placement),scene.getCell());
  bar.innerHTML=`<strong>${FURNITURE.find(s=>s.id===placement!.id)!.label} · (${placement.x},${placement.y}) · หัน ${placement.direction}</strong><p role="status">${error ? 'วางไม่ได้: '+error : '✓ วางได้ · วงสีขาวคือด้านใช้งาน'}</p><div class="actions"><button data-shell="placement-rotate">หมุนของ ↻</button><button data-shell="placement-confirm"${error?' disabled':''}>ยืนยันวาง</button><button data-shell="placement-cancel" class="secondary">ยกเลิก</button></div><p class="small">เลื่อนเมาส์หรือคลิกเลือกช่องในโลก ปุ่มหมุนกล้องอยู่ด้านบน เงินและวัสดุไม่เปลี่ยนจนกว่าจะซื้อแยก</p>`;
}
function furnitureMarkup() {
  const a=activeAttempt(session);
  return `<section class="furniture-sheet"><h3>จัดของฟรี 7 ชิ้น</h3><p>ไม่บังคับวางครบทุกชิ้น เว้นทางเข้าช่อง (7,15) และทางถึงด้านหน้า ฐานกับของจริงใช้เกณฑ์เดียวกัน</p><form id="furniture-form"><label>เลือกของ<select name="item">${FURNITURE.map(s=>`<option value="${s.id}">${s.label}${a.layout.some(p=>p.id===s.id)?' · วางแล้ว (ย้ายได้)':' · อยู่ในคลัง'}</option>`).join('')}</select></label><div class="placement-fields"><label>x<input name="x" type="number" min="4" max="7" step="1" value="4" required></label><label>y<input name="y" type="number" min="15" max="20" step="1" value="16" required></label><label>หันทิศ<select name="direction">${DIRECTIONS.map(d=>`<option${d==='S'?' selected':''}>${d}</option>`).join('')}</select></label></div><button type="submit">ดูเงาในโลกก่อนยืนยัน</button></form><div class="actions"><button data-action="undo-layout"${a.layoutUndo.length?'':' disabled'}>ย้อนการจัด</button><button data-action="redo-layout"${a.layoutRedo.length?'':' disabled'}>ทำซ้ำการจัด</button></div>${a.layout.map(p=>`<div class="placed-row"><span>${FURNITURE.find(s=>s.id===p.id)!.label} · (${p.x},${p.y}) · ${p.direction}</span><button data-action="store" data-item="${p.id}">เก็บเข้าคลัง</button></div>`).join('')}<p class="small">ย้อนเฉพาะการจัดของ ไม่ย้อนซื้อ/คืนวัสดุ เปลี่ยนแบบที่ไม่ผ่านจะไม่ทำลายตำแหน่งเดิม</p></section>`;
}
function buildMarkup() {
  const attempt = activeAttempt(session);
  const result = inspectProject(attempt);
  return `${furnitureMarkup()}<p>ปูพื้นที่จริง 24 ตารางเมตรด้วยวัสดุชนิดเดียว เปิดกล่องเท่าที่จำเป็น วัสดุสำรองยังอยู่ในคลัง</p><div class="inventory-cards">${Object.keys(MATERIALS).map(id => {
    const stock = inventory(attempt, id as MaterialId);
    return `<section><h3>วัสดุ ${id}</h3><dl class="stats"><div><dt>ยังไม่เปิด</dt><dd>${stock.sealedBoxes} กล่อง</dd></div><div><dt>เปิดแล้วเหลือ</dt><dd>${area(stock.unusedCm2)} ตร.ม.</dd></div><div><dt>ปูอยู่</dt><dd>${area(stock.placedCm2)} ตร.ม.</dd></div><div><dt>สำรองรวม</dt><dd>${area(stock.reserveCm2)} ตร.ม.</dd></div></dl><button data-action="place" data-material="${id}"${attempt.floorMaterial ? ' disabled' : ''}>ปูพื้นด้วย ${id}</button></section>`;
  }).join('')}</div><div class="actions"><button data-action="remove"${!attempt.floorMaterial ? ' disabled' : ''}>รื้อและเก็บวัสดุที่เปิด</button><button class="secondary" data-action="go-shop">ซื้อเพิ่ม</button></div><div class="feedback ${result.ready ? 'success' : ''}"><strong>${result.ready ? 'เงื่อนไขวัสดุครบ' : 'ยังต้องปรับ'}</strong><p>${result.message}</p></div><h3>คืนกล่องที่ยังไม่เปิด</h3>${attempt.lots.length ? attempt.lots.map((lot, i) => `<form class="return-form" data-lot="${escape(lot.id)}"><p>ล็อต ${i + 1} · ${lot.materialId} · ซื้อ ${lot.purchasedBoxes} กล่อง · คืนแล้ว ${lot.returnedBoxes} · เหลือยังไม่เปิด ${lot.sealedBoxes}</p><label>จำนวนคืน<input name="boxes" type="number" min="1" step="1" max="${lot.sealedBoxes}" value="1"${lot.sealedBoxes ? '' : ' disabled'}></label><button${lot.sealedBoxes ? '' : ' disabled'}>คืนที่ราคา ${lot.price} เหรียญ/กล่อง</button></form>`).join('') : '<p>ยังไม่มีล็อตซื้อ</p>'}<h3>ทดลองใหม่</h3><p>เริ่มงานใหม่ด้วยงบ 4,000 ไม่โอนเงินหรือวัสดุเดิม ประวัติ ${session.attempts.length} งานยังอยู่ในรอบเปิดหน้านี้</p>${resetConfirmation ? '<div class="confirmation"><p>ร่างปัจจุบันจะถูกเก็บเป็นฉบับก่อนเริ่มใหม่ ประวัติไม่ถูกลบ แต่ข้อมูลทั้งหมดหายเมื่อรีเฟรช</p><button data-action="confirm-reset">ยืนยันเริ่มทดลองใหม่</button> <button class="secondary" data-action="cancel-reset">ทำงานเดิมต่อ</button></div>' : '<button class="secondary" data-action="ask-reset">เริ่มทดลองใหม่</button>'}<details><summary>ดูแผนและการทดลองเดิม</summary>${session.attempts.map((item, i) => `<section><h4>ทดลอง ${i + 1}${i === session.activeIndex ? ' · ปัจจุบัน' : ''}</h4><p>งบเหลือ ${money(item.remaining)} · พื้น ${item.floorMaterial ?? 'ยังไม่ปู'} · แผน ${item.plans.length} ฉบับ</p>${item.plans.map(revision => `<p>ฉบับ ${revision.revision} · ${escape(revision.plan.goal)} · พื้นที่ ${escape(revision.plan.area || 'ยังไม่กรอก')} · เลือก ${revision.plan.selected}<br>${escape(revision.plan.reason)}</p>`).join('')}</section>`).join('')}</details>`;
}
function renderPanel() {
  if (destination === 'lesson' && !activeAttempt(session).helpUsed.includes(LESSONS[lessonIndex]!.id)) {
    session = execute(session, {id:crypto.randomUUID(),type:'help',lessonId:LESSONS[lessonIndex]!.id}); refreshSummary();
  }
  const title: Record<Destination, string> = { plan: 'วางแผนและคำนวณ', lesson: 'บทเรียนตรงขั้น', shop: 'ร้านวัสดุ', build: 'พื้นและคลังวัสดุ', future: 'แผนแรก–แผนแก้ (เตรียมพอร์ต)', settings: 'ตั้งค่าเกม', help: 'สมุดช่วยตามปัญหา' };
  document.querySelector('#panel-title')!.textContent = title[destination];
  body.innerHTML = destination === 'help' ? helpMarkup() : destination === 'future' ? historyMarkup() : destination === 'settings' ? settingsMarkup() : destination === 'plan' ? planMarkup() : destination === 'lesson' ? lessonMarkup() : destination === 'shop' ? shopMarkup() : destination === 'build' ? buildMarkup() : '<p>รอบนี้ให้ทดลองเดิน วางแผน เรียน ซื้อ ปู รื้อ และคืนวัสดุ</p><p>งานถัดไป: จัดเฟอร์นิเจอร์พร้อมตรวจทางเดิน → ประเมินโจทย์ใหม่และแยกเหตุผลรอตรวจ → พอร์ตหลักฐาน → ระบบเซฟและกู้คืน</p><p>ยังไม่ให้รางวัลหรือยืนยันความรู้จากผลการคำนวณในงานฝึก</p><button data-action="go-plan">กลับวางแผน</button>';
  document.querySelector('#panel-message')!.textContent = message;
  if (destination === 'shop') updateCart();
}
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;
function dispatch(command: WithoutId<Command>, success: string) {
  try { session = execute(session, { ...command, id: crypto.randomUUID() } as Command); message = success; refreshSummary();
    if (command.type === 'plan') recordTutorial('plan-saved');
    if (command.type === 'buy') recordTutorial('bought');
    if (command.type === 'place') recordTutorial('floor-placed');
    return true; }
  catch (error) { message = error instanceof Error ? error.message : 'ทำรายการไม่สำเร็จ'; return false; }
}
function updateCart() {
  const amount = Number(cartBoxes), total = amount * MATERIALS[cartMaterial].price;
  const target = document.querySelector('#cart-total');
  if (target) target.textContent = Number.isSafeInteger(amount) && amount > 0 ? `ค่าสินค้า ${money(total)} เหรียญ · ปริมาณ ${area(amount * MATERIALS[cartMaterial].coverageCm2)} ตร.ม. · เงินจะเหลือ ${money(activeAttempt(session).remaining - total)} เหรียญ` : 'กรอกจำนวนเต็มมากกว่า 0';
}
body.addEventListener('input', event => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (input.id === 'help-search') { helpQuery=input.value; document.querySelector('#help-results')!.innerHTML=helpResults(); }
  if (input.id === 'text-scale') { textScale = input.value; document.documentElement.style.setProperty('--text-scale', textScale); scene.setTextScale(Number(textScale)); }
  if (input.id === 'reduce-motion') { reducedMotion = (input as HTMLInputElement).checked; document.documentElement.classList.toggle('reduce-motion', reducedMotion); scene.setReducedMotion(reducedMotion); }
  if (input.closest('#plan-form') && input.name) {
    Object.assign(plan, { [input.name]: input.value }); planFeedback = '';
    const feedback = input.closest('#plan-form')!.querySelector('.feedback');
    if (feedback) feedback.textContent = '';
    document.querySelector('#plan-comparison')!.innerHTML = comparisonMarkup();
  }
  if (input.id === 'cart-material' || input.id === 'cart-boxes') {
    cartMaterial = document.querySelector<HTMLSelectElement>('#cart-material')!.value as MaterialId;
    cartBoxes = document.querySelector<HTMLInputElement>('#cart-boxes')!.value;
    cartRevision = null; purchaseConfirmation = false;
    document.querySelector('.confirmation')?.remove(); updateCart();
  }
});
body.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  if (form.id === 'furniture-form') {
    const data=new FormData(form); placement={id:String(data.get('item')),x:Number(data.get('x')),y:Number(data.get('y')),direction:String(data.get('direction')) as Placement['direction']};
    closePanel(); scene.setPreview(placement); renderPlacementBar(); return;
  }
  if (form.id === 'plan-form') dispatch({ type: 'plan', plan }, 'เก็บฉบับแผนไว้ในรอบเปิดหน้านี้แล้ว');
  if (form.id === 'shop-form') {
    const boxes = Number(cartBoxes), cost = boxes * MATERIALS[cartMaterial].price;
    if (!Number.isSafeInteger(boxes) || boxes <= 0) message = 'จำนวนกล่องต้องเป็นจำนวนเต็มมากกว่า 0';
    else if (!Number.isSafeInteger(cost) || cost > activeAttempt(session).remaining) message = 'เงินไม่พอ ลดจำนวนหรือกลับแก้แผน';
    else { purchaseConfirmation = true; recordTutorial('purchase-reviewed'); message = ''; }
  }
  if (form.classList.contains('return-form')) dispatch({ type: 'return', lotId: form.dataset.lot!, boxes: Number(new FormData(form).get('boxes')) }, 'คืนกล่องและเพิ่มงบตามราคาซื้อแล้ว');
  renderPanel();
});
body.addEventListener('click', event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
  if (!button || button.disabled) return;
  message = '';
  let focusField: string | null = null;
  switch (button.dataset.action) {
    case 'back-settings': { const back=settingsReturn; settingsReturn=null; destination=back ?? 'plan'; break; }
    case 'reset-reading': textScale='1'; reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches; document.documentElement.style.setProperty('--text-scale',textScale); document.documentElement.classList.toggle('reduce-motion',reducedMotion); scene.setTextScale(1); scene.setReducedMotion(reducedMotion); break;
    case 'undo-layout': dispatch({type:'undo-layout',actor:scene.getCell()},'ย้อนการจัดแล้ว เงินไม่เปลี่ยน'); break;
    case 'redo-layout': dispatch({type:'redo-layout',actor:scene.getCell()},'ทำซ้ำการจัดแล้ว เงินไม่เปลี่ยน'); break;
    case 'store': dispatch({type:'store',itemId:button.dataset.item!},'เก็บของเข้าคลังแล้ว'); break;
    case 'lesson':
      if (destination !== 'lesson') { returnFromLesson = destination; lessonReturnField = button.dataset.returnField ?? null; }
      lessonIndex = Number(button.dataset.lesson);
      dispatch({type:'help',lessonId:LESSONS[lessonIndex]!.id},'เปิดบทฝึก'); destination = 'lesson'; break;
    case 'back-lesson': recordTutorial('lesson-returned'); destination = returnFromLesson; focusField = lessonReturnField; break;
    case 'go-plan': destination = 'plan'; break;
    case 'go-shop': destination = 'shop'; break;
    case 'go-build': destination = 'build'; break;
    case 'check-plan': {
      const a = estimate('A'), b = estimate('B');
      const checks: [keyof Plan, string, number][] = [['area', 'พื้นที่จริง', 24], ['allowance', 'ส่วนเผื่อ', 2.4], ['required', 'ปริมาณรวม', 26.4], ['boxesA', 'กล่อง A', a.boxes], ['costA', 'ราคา A', a.cost], ['boxesB', 'กล่อง B', b.boxes], ['costB', 'ราคา B', b.cost]];
      planFeedback = '<strong>ผลตรวจตัวเลขสำหรับฝึก</strong><ul>' + checks.map(([name, label, expected]) => {
        const value = plan[name].trim();
        return `<li>${label}: ${!value ? 'ยังไม่กรอก' : Number(value) === expected ? 'ตรงตามข้อมูลโจทย์' : 'ลองทบทวนหน่วยและขั้นคำนวณ หรือเปิดบทตรงขั้น'}</li>`;
      }).join('') + '</ul><p>เหตุผลยังไม่มีผู้ตรวจ ผลนี้ไม่ยืนยันความรู้</p>'; break;
    }
    case 'use-plan': {
      const boxes = Number(plan.selected === 'A' ? plan.boxesA : plan.boxesB);
      if (!Number.isSafeInteger(boxes) || boxes <= 0) { message = 'กรอกจำนวนกล่องของวัสดุที่เลือกเป็นจำนวนเต็มมากกว่า 0 ก่อน'; break; }
      if (dispatch({ type: 'plan', plan }, 'ส่งจำนวนจากแผนไปตะกร้าแล้ว ยังไม่ซื้อ')) {
        cartMaterial = plan.selected; cartBoxes = String(boxes); cartRevision = activeAttempt(session).plans.length; destination = 'shop'; purchaseConfirmation = false;
      }
      break;
    }
    case 'confirm-buy': dispatch({ type: 'buy', materialId: cartMaterial, boxes: Number(cartBoxes) }, 'ซื้อสำเร็จและหักเงินแล้ว'); purchaseConfirmation = false; break;
    case 'cancel-buy': purchaseConfirmation = false; break;
    case 'place': dispatch({ type: 'place', materialId: button.dataset.material as MaterialId }, 'ปูพื้นที่จริง 24 ตารางเมตรแล้ว ตรวจสำรองต่อได้'); break;
    case 'remove': dispatch({ type: 'remove' }, 'รื้อแล้ว วัสดุที่เปิดกลับเข้าคลัง ใช้ใหม่ได้แต่คืนเงินไม่ได้'); break;
    case 'ask-reset': resetConfirmation = true; break;
    case 'cancel-reset': resetConfirmation = false; break;
    case 'confirm-reset':
      dispatch({ type: 'plan', plan }, 'เก็บแผนก่อนเริ่มใหม่');
      if (dispatch({ type: 'reset' }, 'เริ่มทดลองใหม่ ประวัติเดิมยังอยู่ในรอบเปิดหน้านี้')) { plan = blankPlan(); planFeedback = ''; cartRevision = null; purchaseConfirmation = false; resetConfirmation = false; }
      break;
  }
  renderPanel();
  if (focusField) body.querySelector<HTMLElement>(`[name="${focusField}"]`)?.focus();
});
refreshSummary(); renderTutorial();
document.documentElement.classList.toggle('reduce-motion', reducedMotion); scene.setReducedMotion(reducedMotion);
window.addEventListener('beforeunload', event => {
  const initial = blankPlan();
  if (Object.keys(session.commands).length || Object.keys(plan).some(key => plan[key as keyof Plan] !== initial[key as keyof Plan])) { event.preventDefault(); event.returnValue = ''; }
});
