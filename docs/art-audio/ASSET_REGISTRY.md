# ทะเบียนภาพต้นแบบ
ฉบับออกแบบ 0.1 — ทุกแถวพร้อมพร็อมป์ตัวอย่างหรือรอเขียน ยังไม่มีภาพผลิต/อนุมัติ/รวมเกม
เริ่มด้วย [STYLE_SAMPLE](../../asset-prompts/style/STYLE_SAMPLE.md) ให้ผู้ใช้สร้างภายนอกแล้วตรวจก่อนขยายชุด

| ID | ลำดับ | สเปกทดลอง/ไฟล์คาดหวัง | สถานะ |
| --- | --- | --- | --- |
| CHAR-001 | style sample | canvas160×192 RGBA; player-idle.png และ player-walk-se-{01,02}.png; เท้ากึ่งกลาง(80,176) | ready |
| ENV-001 | style sample | 128×64 RGBA พื้นรูปเพชร grass-tile.png; anchor(64,32); footprint1×1m | ready |
| OBJ-001 | style sample | 256×256 RGBA desk.png; anchor(128,224); footprint2×1cells | ready |
| CHAR-002–004 | prototype | ผู้ขาย/ผู้ช่วยเรียน/ชุมชน;4ทิศ×2เดิน+idle/work | prompt not written |
| BUILD-001–003 | prototype | ร้านA/Bและศูนย์เรียน;แยกหลังคา/ผนัง;กำหนด footprint ก่อนผลิต | prompt not written |
| OBJ-002–006 | prototype | storage/sign/bench/work board/portfolio board;ไม่ใส่ตัวหนังสือในภาพ | prompt not written |
| ENV-002–004 | prototype | path/tree/cloth;ต้นไม้และผ้า2เฟรม anchor เดิม | prompt not written |
| MAT-001–002 | prototype | previewพื้นA/B ไม่สื่อคุณภาพที่โจทย์ไม่ได้ระบุ | prompt not written |

ขนาดเป็นข้อเสนอทดลอง ไม่ใช่มาตรฐานสุดท้าย ก่อนรับภาพเก็บ promptVersion, service/source, generationDate, usageTerms, originalFilename, reviewNotes และ approvedFilename ของแต่ละไฟล์ สิทธิ์ไม่ชัดใช้ needs revision ยังไม่ integrated
ตรวจมุม/แสง/alpha/ขอบ/anchor/การอ่านที่ซูม/geometry drift และตำแหน่งเท้า ภาพเดินสองเฟรมต้องต่างท่าพอเห็นแต่ร่างไม่เปลี่ยน ตัวอักษร ราคา สูตร หน่วยและกราฟทำด้วยโค้ด
