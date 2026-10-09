export type TutorialEvent = 'welcome' | 'moved' | 'plan-opened' | 'plan-saved' | 'bought' | 'floor-placed';
export const TUTORIAL_STEPS = [
  { event: 'welcome', title: 'ยินดีต้อนรับสู่พื้นที่ของคุณ', text: 'คุณมีที่ดินเล็ก ๆ และงบ 4,000 เหรียญ ลองสร้างมุมอ่านหนังสือ ร้านเล็ก หรือที่พักผ่อน เริ่มจากเรียนวิธีเดินและใช้เครื่องมือ', action: 'เริ่มสอนเล่น' },
  { event: 'moved', title: 'ลองเดินดูชุมชน', text: 'คลิกพื้นโล่งที่อยู่ห่างออกไป ตัวละครจะเดินอ้อมสิ่งของและกล้องตามไปด้วย ปุ่มหมุนมุมมองด้านบนใช้ดูอีกด้านได้', action: 'พาเดินไปลานกลาง' },
  { event: 'plan-opened', title: 'ไปที่โต๊ะวางแผน', text: 'คลิกโต๊ะหรือป้ายชื่อเพื่อเดินไปใช้งาน ถ้าอยู่ไกล กดนำทางด้านล่างได้ แผนจะช่วยให้ซื้อวัสดุพอก่อนใช้เงินจริง', action: 'นำทางไปโต๊ะ' },
  { event: 'plan-saved', title: 'ร่างแผนแรกของคุณ', text: 'ในสมุดแผน เลือกเป้าหมาย กรอกพื้นที่และวัสดุ แล้วกดเก็บฉบับแผน หากติดตรงไหน กดเรียนตรงขั้นนั้นแล้วกลับมาร่างเดิมได้', action: 'เปิดสมุดแผน' },
  { event: 'bought', title: 'ไปซื้อวัสดุ', text: 'ร้าน A/B ให้ข้อมูลความจุและราคา เลือกจำนวนกล่อง ตรวจรายการ แล้วกดยืนยันซื้อจึงหักเงิน กล่องที่เปิดแล้วคืนเงินไม่ได้', action: 'นำทางไปร้าน' },
  { event: 'floor-placed', title: 'ลงมือปูพื้นที่ของคุณ', text: 'เปิดคลังแล้วเลือกปูพื้นด้วย A หรือ B ระบบจะแสดงวัสดุที่ใช้และสำรอง ถ้าไม่พอ ซื้อเพิ่มหรือกลับแก้แผนได้', action: 'เปิดคลังและปูพื้น' },
] as const;
export class Tutorial {
  private observed = new Set<TutorialEvent>();
  visible = true;
  get index() { const index = TUTORIAL_STEPS.findIndex(step => !this.observed.has(step.event)); return index === -1 ? TUTORIAL_STEPS.length : index; }
  record(event: TutorialEvent) { this.observed.add(event); }
  replay() { this.observed.clear(); this.visible = true; }
}
