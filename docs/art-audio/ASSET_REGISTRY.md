# ทะเบียนภาพต้นแบบ

> ล่าสุด: กล้องติดตามและหมุน 4 มุมเพิ่มแล้วใน placeholder runtime. จำนวน 83 ภาพในเอกสารฐานยังไม่รวม variants อาคาร/วัตถุ/cloth ตามกล้อง; เสนอ 119 ภายใต้เงื่อนไขใน [GAME_UI_REVISION](../ui/GAME_UI_REVISION.md). อ่าน [พร็อมป์กล้อง](../../asset-prompts/prototype/CAMERA_VIEW_PROMPTS.md) ก่อนผลิตเพิ่ม ยังไม่มี PNG จริงที่อนุมัติ/ผูก runtime.

ฉบับออกแบบ 0.1 — ทุกแถวพร้อมพร็อมป์ตัวอย่างและรายละเอียดต่อยอด ยังไม่มีภาพผลิต/อนุมัติ/รวมเกม
เริ่มด้วย [STYLE_SAMPLE](../../asset-prompts/style/STYLE_SAMPLE.md) ให้ผู้ใช้สร้างภายนอกแล้วตรวจก่อนขยายชุด

| ID | ลำดับ | สเปกทดลอง/ไฟล์คาดหวัง | สถานะ |
| --- | --- | --- | --- |
| CHAR-001 | style sample | canvas160×192 RGBA; player-idle.png และ player-walk-se-{01,02}.png; เท้ากึ่งกลาง(80,176) | ready |
| ENV-001 | style sample | 128×64 RGBA พื้นรูปเพชร grass-tile.png; anchor(64,32); footprint1×1m | ready |
| OBJ-001 | style sample | 256×256 RGBA desk-s.png; anchor(128,224); footprint2×1cells | ready |
| CHAR-002–004 | prototype | ผู้ขาย/ผู้ช่วยเรียน/ชุมชน;4ทิศ×2เดิน+idle; workภายหลัง | ready — ดู PROTOTYPE_PRODUCTION |
| BUILD-001–003 | prototype | ร้านA/Bและศูนย์เรียน;แยกหลังคา/ผนัง;กำหนด footprint ก่อนผลิต | ready — ดู PROTOTYPE_PRODUCTION |
| OBJ-002–006 | prototype | storage/sign/bench/work board/portfolio board;ไม่ใส่ตัวหนังสือในภาพ | ready — ดู PROTOTYPE_PRODUCTION |
| ENV-002–004 | prototype | path/tree/cloth;ต้นไม้และผ้า2เฟรม anchor เดิม | ready — ดู PROTOTYPE_PRODUCTION |
| MAT-001–002 | prototype | previewพื้นA/B ไม่สื่อคุณภาพที่โจทย์ไม่ได้ระบุ | ready — ดู PROTOTYPE_PRODUCTION |

ขนาดเป็นข้อเสนอทดลอง ไม่ใช่มาตรฐานสุดท้าย ก่อนรับภาพเก็บ promptVersion, service/source, generationDate, usageTerms, originalFilename, reviewNotes และ approvedFilename ของแต่ละไฟล์ สิทธิ์ไม่ชัดใช้ needs revision ยังไม่ integrated
ตรวจมุม/แสง/alpha/ขอบ/anchor/การอ่านที่ซูม/geometry drift และตำแหน่งเท้า ภาพเดินสองเฟรมต้องต่างท่าพอเห็นแต่ร่างไม่เปลี่ยน ตัวอักษร ราคา สูตร หน่วยและกราฟทำด้วยโค้ด

## รายการละเอียดฉบับต่อยอด
[PROTOTYPE_PRODUCTION](PROTOTYPE_PRODUCTION.md) ระบุcanvas/anchor/footprint/filenameครบขั้นต่ำ83ภาพuniqueและ10เสียง; [พร็อมป์prototype](../../asset-prompts/prototype/PROTOTYPE_PROMPTS.md) เขียนแล้ว สถานะภาพที่มีpromptในฉบับนี้คือreadyเท่านั้น เสียงยังเป็นspec pending source ไม่มีไฟล์จริงapproved/integrated ขนาดรวมและlogicalfrontดูSCENE_OBJECT_SPEC
ชื่อsampledesk-s.pngเดิมยังไม่มีไฟล์จริง ใช้ชื่อเป้าหมายdesk-s.pngตามlogicalsouth/SWในการผลิตใหม่ ทิศcharacterยังใช้screenSEไม่ต้องเปลี่ยน
