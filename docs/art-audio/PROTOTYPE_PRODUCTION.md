# รายการภาพและเสียงขั้นต่ำพร้อมข้อกำหนด

> ได้รับชุดอัปโหลด 33 PNG และ preflight แล้ว ดู [ผลตรวจและแผนแก้ตามภาพ](COMMISSIONED_ART_REVIEW.md) ห้ามเปลี่ยนเป็น approved/integrated ก่อนตรวจจริง

> ล่าสุด: กล้องติดตามและหมุน 4 มุมเพิ่มแล้วใน placeholder runtime. จำนวน 83 ภาพในเอกสารฐานยังไม่รวม variants อาคาร/วัตถุ/cloth ตามกล้อง; เสนอ 119 ภายใต้เงื่อนไขใน [GAME_UI_REVISION](../ui/GAME_UI_REVISION.md). อ่าน [พร็อมป์กล้อง](../../asset-prompts/prototype/CAMERA_VIEW_PROMPTS.md) ก่อนผลิตเพิ่ม ยังไม่มี PNG จริงที่อนุมัติ/ผูก runtime.


ฉบับเสนอ0.1 — 9ตุลาคม2026; ฐานสเปกเดิม; ปัจจุบันได้รับ 33 PNG เป็น incoming ยังไม่มี approved/integrated; ภาพสร้างภายนอกโดยผู้ใช้
ใช้ [scene/object](../game-design/SCENE_OBJECT_SPEC.md) เป็นฐาน footprint/front; [พร็อมป์รายชิ้น](../../asset-prompts/prototype/PROTOTYPE_PROMPTS.md)

## 1. มาตรฐานทดลอง

projection2:1 tile128×64; logicx+จอSE logicy+จอSW; แสงบนซ้าย palettecream/green/blue/gold/terracottaตามhandoff outlineนุ่ม ภาพRGBAโปร่งใส; anchorพิกเซลอ้างมุมฐานที่ต่ำสุดให้ตรงworldanchorในSCENE_OBJECT_SPEC
ไฟล์incomingเก็บต้นฉบับ source/service/promptVersion/date/usageTerms แยกapproved ไม่เปลี่ยนสถานะจากขนาดตรงอย่างเดียว ตรวจgeometry/ทิศ/ความคม/anchor/alphaและสิทธิ์ก่อนapproved integratedได้หลังทดสอบเกมจริง
เงาสัมผัสต้นแบบวาดด้วยโค้ดแยกจากsprite ห้ามbaked shadowยาวทำให้เข้าใจฐานผิด ชื่อราคา/สูตร/ตัวเลขทั้งหมดทำด้วยโค้ด
ขนาดcanvasเป็นทดลอง ถ้ารูปบีบไม่พอให้เพิ่มcanvasและanchorพร้อมกัน ไม่ลดfootprintเพื่อให้ภาพพอดี; ตรวจที่zoomจริงก่อนผลิตครบ

## 2. ภาพที่ต้องมี

| ID / ชิ้น | canvas px / anchor px | footprint | ไฟล์/เฟรมขั้นต่ำ |
| --- | --- | --- | --- |
| CHAR-001 player | 160×192 /(80,176) | dynamic1cell | player-idle-{ne,se,sw,nw}.png และ player-walk-{dir}-{01,02}.png;12ไฟล์ |
| CHAR-002 seller | 160×192 /(80,176) | dynamic1cell | seller-idle-{dir}.png / seller-walk-{dir}-{01,02}.png;12ไฟล์ |
| CHAR-003 guide | 160×192 /(80,176) | dynamic1cell | guide-idle-{dir}.png / guide-walk-{dir}-{01,02}.png;12ไฟล์ |
| CHAR-004 neighbour | 160×192 /(80,176) | dynamic1cell | neighbour-idle-{dir}.png / neighbour-walk-{dir}-{01,02}.png;12ไฟล์ |
| ENV-001 grass | 128×64 /(64,32) | ground1×1 | grass-tile.png |
| ENV-002 path | 128×64 /(64,32) | ground1×1 | path-tile.png; ไม่มีเส้นขอบเข้มเมื่อวางต่อ |
| MAT-001 A | 128×64 /(64,32) | ground1×1 | floor-a-tile.png |
| MAT-002 B | 128×64 /(64,32) | ground1×1 | floor-b-tile.png; ต่างลายไม่อ้างคุณภาพต่าง |
| BUILD-001 shopA | 384×448 /(192,416) | 3×2 | shop-a-body.png / shop-a-roof.png layercanvas/anchorเดียวกัน |
| BUILD-002 shopB | 384×448 /(192,416) | 3×2 | shop-b-body.png / shop-b-roof.png |
| BUILD-003 centre | 768×768 /(384,704) | 6×4 | learning-centre-body.png / learning-centre-roof.png |
| OBJ-001 planningdesk | 256×256 /(128,224) | 2×1 | desk-s.png แชร์DEC-001southได้ |
| OBJ-002 storage | 256×256 /(128,224) | 2×1 | storage.png; ไม่ใส่ตัวเลขจำนวน |
| OBJ-003 sign | 128×192 /(64,176) | 1×1 | project-sign.png; เว้นที่ข้อความ |
| OBJ-004 bench | 256×256 /(128,224) | 2×1 | bench-s.png แชร์DEC-004southได้ |
| OBJ-005 workboard | 256×320 /(128,288) | 2×1 | work-board.png; เว้นlabelจากcode |
| OBJ-006 portfolio | 256×320 /(128,288) | 2×1 | portfolio-board.png; เว้นlabelจากcode |
| DEC-001 desk | 256×256 /(128,224) | 2×1หรือ1×2 | desk-{n,e,s,w}.png;4variantรวมOBJ-001 |
| DEC-002 chair | 128×192 /(64,176) | 1×1 | chair-{n,e,s,w}.png;4variant |
| DEC-003 shelf | 256×384 /(128,352) | 2×1หรือ1×2 | shelf-{n,e,s,w}.png;4variant |
| DEC-004 bench | 256×256 /(128,224) | 2×1หรือ1×2 | bench-{n,e,s,w}.png;4variantรวมOBJ-004 |
| DEC-005 plant | 128×192 /(64,176) | 1×1 | potted-plant.png;1variant |
| ENV-003 tree | 192×320 /(96,288) | 1×1 | tree-{01,02}.png; trunk/baseคงตำแหน่ง |
| ENV-004 cloth | 128×192 /(64,176) | 1×1 | cloth-{01,02}.png; poleคงตำแหน่ง |

dircharacterเป็นทิศจอ ne/se/sw/nw ไม่ใช่logical n/e/s/w: logicaln=NE,e=SE,s=SW,w=NW DECsuffixใช้logicaldirectionเพื่อให้ตรงfrontcells
ยอดจากunique filenames: 48+4+6+4+17+4=83ไฟล์ ภาพdesk/benchไม่สร้างซ้ำ; work/idleสองเฟรมและvariantspathเพิ่มเติมเป็นlater ห้ามตีจำนวนในregistryเป็นงานที่ผลิตแล้ว

## 3. ลำดับผลิตภายนอก

1. style sample5ไฟล์: player-idle-se + walk-se01/02 + grass + desk-s (แก้ชื่อdesk.pngเดิมเป็นmappingsampledesk-sหลังตรวจ ไม่อ้างมีไฟล์จริง)
2. ตรวจมุม/anchorและคู่เดิน ถ้าไม่ผ่านแก้sampleก่อนขยายทั้ง83
3. ground4และobject/DECที่จำเป็นต่อโครงการ; characterทิศอื่นใช้referenceเดิม
4. ร้าน/ศูนย์และNPC; roofแยกเพื่อfadeเมื่อบังplayer ไม่ให้codeพยายามตัดroofจากcompositeภาพเดียว
5. tree/clothหลังเส้นทางและการอ่านผ่าน ลดmotionใช้frameแรกไม่ลดคะแนน

ผู้ใช้ส่งไฟล์ต้นฉบับพร้อมID ภาพที่สร้างไว้เปลี่ยนcanvasหรือgeometryต้องตรวจanchorsอีกครั้ง ไม่มีภาพใหม่เกิดในงานเอกสารนี้

## 4. เสียงขั้นต่ำ — สเปกสำหรับสร้าง/จัดหาภายหลัง

เสียงต้องมีsource/use termsเช่นภาพ ไม่ขอใช้บริการเสียเงินอัตโนมัติ เสนอOGGสำหรับเว็บและเก็บต้นฉบับWAVเมื่อมี; ไม่เรียกสร้างเสียงในรอบนี้

| ID / file | ระยะทดลอง | ใช้เมื่อ / กลุ่ม | การควบคุม/ภาพแทน |
| --- | --- | --- | --- |
| AUD-001 music-world.ogg | loop60–90s | โลก/เพลง | melodyเบา ลดvolumeระหว่างอ่าน; ปิดได้ |
| AUD-002 ambience-community.ogg | loop20–40s | สำรวจ/บรรยากาศ | ไม่ตอกเสียงNPCถี่; ลดขณะอ่าน |
| AUD-003 step-grass.ogg | 0.1–0.25s | เดินหญ้า/world | ตามระยะเดิน ไม่ซ้อนทุกframe |
| AUD-004 step-path.ogg | 0.1–0.25s | เดินทาง/world | ลดmotionไม่จำเป็นต้องปิดเสียง แต่มีcontrolแยก |
| AUD-005 ui-open.ogg | 0.1–0.2s | เปิดpanel/UI | panel/titleแสดงแทนเสียง |
| AUD-006 place.ogg | 0.15–0.35s | วางสำเร็จ/world | preview→commitแล้วเล่นเท่านั้น |
| AUD-007 purchase.ogg | 0.2–0.4s | transactionซื้อสำเร็จ/world | แสดงยอด/เงินใหม่ ไม่เล่นก่อนcommit |
| AUD-008 return.ogg | 0.2–0.4s | คืนกล่องสำเร็จ/world | แสดงเงินและจำนวนคืน |
| AUD-009 review.ogg | 0.1–0.3s | จุดต้องทบทวน/feedback | สุภาพไม่มีเสียงลงโทษ; คำอธิบายเจาะขั้น |
| AUD-010 complete.ogg | 0.5–1s | สำเร็จโลก/reward | ป้ายสำเร็จโลกไม่ใช่mastery |

ตั้งvolumeแยกmusic/ambience/world/UI-feedback muteall; audioเริ่มหลังgestureผู้เล่น ไม่ทำให้playไม่ได้ถ้าaudioโหลดล้มเหลว เสนอeffectพร้อมกันไม่เกิน4และstepไม่เกิน1ต่อ150msเป็นค่าทดลอง จำกัดplayซ้ำcommandเดิม

## 5. สิ่งที่ใช้โค้ดแทนbitmap

แปลนแม่นยำ grid/axes labelราคา/สูตร/หน่วย graph ปุ่ม card ลูกศร status focusoutline occupancy preview selection route และcontactshadow UIทั้งหมดอ่านได้เมื่อเพิ่มขนาดตัวอักษร ไม่มีการสร้างภาพสูตรคณิตศาสตร์หรือเลขเฉลยไว้ในsprite

## ใบงานแก้/เพิ่มสำหรับชุดคอมมิช

ใช้ [เอกสารส่งงาน](ART_REPAIR_WORK_ORDER.md) และ [พร็อมป์แก้พร้อมชื่อไฟล์](../../asset-prompts/prototype/ART_REPAIR_AND_MISSING_PROMPTS.md) เริ่มจากชุดเล็กก่อนชุดเต็ม ค่าสเปกเดิมเป็นฐาน การเปลี่ยนcanvas/anchorต้องบันทึกและตรวจจริงก่อนผูก runtime
