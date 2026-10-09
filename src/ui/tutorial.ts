export type TutorialEvent = 'welcome' | 'moved' | 'plan-opened' | 'plan-saved' | 'lesson-returned' | 'purchase-reviewed' | 'bought' | 'floor-placed';
export const TUTORIAL_STEPS = [
  { event: 'welcome', title: 'พื้นที่นี้เป็นของคุณ', text: 'เลือกทำมุมอ่านหนังสือ ร้านเล็ก หรือพื้นที่พักผ่อน ใช้คณิตช่วยเลือกวัสดุและจัดพื้นที่ เริ่มจากลองเครื่องมือทีละอย่างได้', action: 'เริ่มสอนเล่น' },
  { event: 'moved', title: 'คลิกพื้น แล้วเดินดูชุมชน', text: 'คลิกพื้นโล่ง ตัวละครเดินหลบฐานสิ่งของไปให้ จุดสีทองหน้าอาคารคือจุดใช้งาน ↶ / ↷ หมุนกล้อง ไม่ได้หมุนของ', action: 'ลองเดินไปลาน' },
  { event: 'plan-opened', title: 'ดูเป้าหมายและเปิดสมุด', text: 'บัตรโครงการด้านขวาบอกสิ่งที่จะทำต่อ เปิดสมุดได้จากบัตรหรือโต๊ะ พื้นที่ 4×6 เมตรวัดด้วยแปลน ไม่วัดจากภาพเอียง', action: 'นำทางไปโต๊ะ' },
  { event: 'plan-saved', title: 'ลองร่างแผนของคุณ', text: 'คำนวณพื้นที่ ส่วนเผื่อ และจำนวนกล่อง A/B ตารางเปรียบเทียบใช้ตัวเลขที่คุณกรอก เก็บร่างได้แม้ยังคิดไม่เสร็จ ไม่ใช่การตัดสินความรู้', action: 'เปิดสมุดแผน' },
  { event: 'lesson-returned', title: 'ขอเรียนแล้วกลับมาร่างเดิม', text: 'กดเรียนตรงขั้นหรือค้นในสมุดช่วย แล้วกดกลับ ร่างเดิมยังอยู่ ถ้ารู้วิธีแล้วข้ามการสอนนี้ได้จากรายการสอน', action: 'เปิดสมุดช่วย' },
  { event: 'purchase-reviewed', title: 'ตรวจรายการก่อนใช้เงินจริง', text: 'เลือกวัสดุและจำนวน ดูปริมาณ ราคา และเงินเหลือ ใบยืนยันซื้อยังไม่หักเงิน ถ้าไม่พอให้แก้รายการหรือกลับแผน', action: 'เปิดร้านวัสดุ' },
  { event: 'bought', title: 'ยืนยันซื้อเมื่อพร้อม', text: 'กดยืนยันแล้วของเข้าคลังและเงินลด กล่องยังไม่เปิดคืนราคาเดิมได้ กล่องเปิดแล้วใช้ใหม่ได้แต่คืนเงินไม่ได้', action: 'เปิดร้านวัสดุ' },
  { event: 'floor-placed', title: 'ปูพื้น แล้วจัดพื้นที่เอง', text: 'เปิดคลังเลือกปูพื้น จากนั้นเลือกจัดของฟรี ดูเงาฐานและทางเข้าก่อนยืนยัน ย้าย หมุน เก็บ และย้อนการจัดได้โดยไม่ย้อนซื้อ', action: 'เปิดคลังและจัดของ' },
] as const;
export class Tutorial {
  private observed = new Set<TutorialEvent>();
  visible = true;
  get index() { const i = TUTORIAL_STEPS.findIndex(step => !this.observed.has(step.event)); return i === -1 ? TUTORIAL_STEPS.length : i; }
  record(event: TutorialEvent) { this.observed.add(event); }
  replay() { this.observed.clear(); this.visible = true; }
  skipCurrent() { const step = TUTORIAL_STEPS[this.index]; if (step) this.record(step.event); }
}
