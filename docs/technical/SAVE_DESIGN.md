# เซฟ ตัวอย่าง และการกู้คืน
ฉบับออกแบบ 0.1 — ยังไม่มี IndexedDB หรือ export/import implementation

## Envelope ที่เสนอ
schemaVersion, contentVersion, exportedAt, projects, projectAttempts, assessments, portfolio, unlockGrants, settings, appliedCommands
ตัวอย่าง [SAVE_EXAMPLE.json](SAVE_EXAMPLE.json) เป็นข้อมูลสังเคราะห์เพื่อทบทวน ไม่ใช่เซฟผู้เล่นจริง และไม่ใช่ไฟล์ที่นำเข้าเกมได้ในตอนนี้
ฐานแรกกำหนด schemaVersion `1-design`; เมื่อเขียน validator ต้องกำหนดเลขรุ่นจริงและ migration อย่างชัดเจน ไม่รับ `1-design` เข้าระบบจริงโดยเงียบ ๆ

## ตัวอย่างที่เลือก
A ซื้อ18 เปิด16 ปู24 m² เหลือกล่องปิด2 =3 m² งบเหลือ760 การคำนวณประเมิน C/D ตรวจตัวเลขได้ แต่เหตุผลยัง pending ผลโลกพร้อมสรุปได้เพราะเงื่อนไขโลกครบ พอร์ตบันทึกแล้วไม่ทำให้ความรู้ยืนยัน
ตัวอย่างมีหนึ่ง project attempt และหนึ่ง assessment attempt ซึ่งเป็นคนละ ID/โจทย์ ไม่มี unlock จาก mastery

## Import ที่ต้องพัฒนา
1. แสดงขนาด/ชนิดไฟล์; ข้อเสนอเริ่มต้น JSON ไม่เกิน5 MiB ภาพแยกไม่เกิน2 MiB/ภาพและ20 MiB/ชุด ต้องทดสอบก่อนยืนยัน
2. parse ในพื้นที่ staging; ตรวจ schema/ชนิด/range/ID ซ้ำ/การอ้างอิง/หน่วย/สมดุล/lot/งบ/task snapshots ห้ามเชื่อค่า cached completion/mastery
3. รุ่นใหม่กว่าที่รองรับให้หยุดและอธิบาย รุ่นเก่า migrate สำเนาโดยไม่ทับต้นฉบับ migration ล้มเหลวคงเซฟเดิม
4. แสดงจำนวนงาน/พอร์ต/ผลรอตรวจและวันส่งออก; โหมดต้นแบบ replace ทั้งชุด ไม่ merge จนมีกฎ conflict
5. สำรองเซฟเดิมก่อนยืนยัน replace ถ้าสำรองไม่ได้ไม่เขียนทับ
6. เขียน transaction เดียว; ตรวจโหลดกลับ หากล้มเหลวคืนเซฟเดิมและให้ดาวน์โหลดข้อมูลกู้คืน

ไม่ replay buy/return/grant จากประวัติระหว่าง import; โหลด state กับ command ledger ที่ตรวจแล้ว ไม่มีผลภายนอก/สิทธิ์เพิ่มเพียงเพราะเปิดไฟล์
ข้อมูลเป็น local editable ไม่มีการรับรองป้องกันแก้ผลสำหรับงานสอบจริง

## ภาพและความเป็นส่วนตัว
coverRef เป็น asset ID ไม่รับ URL ภายนอก arbitrary หรือ HTML ใน caption ตรวจ blob ชนิด/ขนาดและการอ้างอิง ภาพ placeholder ใน fixture เป็นชื่ออ้างอิงเท่านั้น
ก่อน export บอกว่ารวมชื่อผลงาน คำตอบ เหตุผล และภาพใด ผู้เล่นเลือกส่วนที่จะเปิดเผยเมื่อทำระบบ share ภายหลัง; ต้นแบบไม่มีการอัปโหลดอัตโนมัติ
ก่อนเปลี่ยน host ให้ส่งออก เพราะ origin/browser profile ต่างกันเซฟแยกกัน

## ชุดกรณีตรวจรับที่ต้องเขียนภายหลัง
save/reload ทุกขั้นซื้อ/เปิด/ปู/คืน/รีเซ็ต; ปิดหน้าระหว่าง transaction; quota เต็ม; JSON ตัดขาด; ID ซ้ำหรืออ้างอิงหาย; เงิน/วัสดุติดลบ; คืนเกิน; task version หาย; schema ใหม่; migration ล้มเหลว; สำรองล้มเหลว; import ซ้ำไม่รับรางวัลซ้ำ; pending ไม่เปลี่ยนเป็น confirmed
