# พร็อมป์ตัวอย่างสไตล์ภายนอก
ฉบับ1 — สถานะ ready ยังไม่สร้างภาพ ขอสร้างแยกชิ้น ใช้ภาพชิ้นแรกเป็น reference ชิ้นถัดไป

สไตล์ร่วม: warm hand-drawn cartoon, simple readable silhouettes, soft clean outlines, restrained texture, cream green blue gold terracotta palette, angled 2D game view, upper-left light, transparent RGBA background, no text, no watermark, no interface, no collage.

## CHAR-001
“Create one friendly student player character for a secondary-school mathematics sandbox. [shared style]. Full body facing southeast, idle pose, fixed 160×192 canvas, feet centered at (80,176), leave space above and at sides. Separate contact shadow. No props covering hands or feet.”
ใช้ idle ที่ตรวจแล้วเป็น reference: “Preserve exact face, clothing, body scale, camera, canvas and foot anchor. Produce the southeast walk frame 01 with left leg forward.” ทำอีกไฟล์เฟรม02ขาขวา ห้ามสร้างทั้งชุดทิศก่อนตรวจคู่แรก
Expected: player-idle.png, player-walk-se-01.png, player-walk-se-02.png

## ENV-001
“Create one seamless grass ground diamond tile,128×64 canvas, 2:1 angled projection. [shared style]. Diamond vertices (64,0),(128,32),(64,64),(0,32), transparent outside, no raised objects or baked cast shadow. Subtle texture without heavy edge border.” ตรวจต่อไทล์จริงภายหลัง
Expected: grass-tile.png

## OBJ-001
“Create a small friendly wooden planning desk, southeast view in matching 2:1 angled projection. [shared style]. One object only,256×256 canvas, base anchor(128,224), logical footprint2×1 cells. No lettering, no ruler numbers, no human, separate shadow.”
Expected: desk.png

เครื่องมือสร้างอาจไม่รักษาขนาด/anchor ตามข้อความ ต้องตรวจและปรับภายนอกก่อนอนุมัติ ไม่ถือว่า ready เท่ากับ approved ใช้ sample สรุปสไตล์ก่อนเขียนพร็อมป์ครบชุด
