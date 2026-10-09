# ใบงานแก้ภาพคอมมิชและพร็อมป์ภาพที่ขาด

9 ตุลาคม 2026 · ผู้ใช้อนุมัติแผนเกม 7 จุด + E1/E2/E5 และเตรียม E6 · **เอกสารสำหรับสร้างภาพภายนอก ไม่ใช่ภาพที่สร้างแล้ว**

อ่าน [ผลตรวจ 33 PNG](../../docs/art-audio/COMMISSIONED_ART_REVIEW.md) และ [ค่าขนาด/จุดยึด](../../docs/art-audio/PROTOTYPE_PRODUCTION.md) พร้อมกัน เก็บต้นฉบับทั้งหมด ไม่เขียนทับไฟล์คอมมิชเดิม การแก้ภาพไม่เปลี่ยนพื้นที่ 4×6 เมตร งบ 4,000 หรือกติกาวัสดุ

## 1. ลำดับส่งงาน — อย่าสร้างครบชุดทันที

1. ทดลองผู้เล่น idle SE + walk SE 01/02, grass 128×64 และ desk S เป็น reference ร่วม ตรวจมุม/สไตล์/เท้าก่อน
2. ทำ tile path/A/B และต้นไม้/ธงคู่เฟรมที่ฐานไม่ขยับ
3. ทำ shop A body/roof view 0 ที่ซ้อนพอดี แล้ว view 1 ก่อนร้าน B/ศูนย์เรียน
4. ทำเก้าอี้/ชั้น N/E/S/W ใต้กล้องฐานเดียว และทิศโต๊ะ/ม้านั่งที่ขาด
5. เมื่อกลุ่มแรกผ่านจึงทำตัวละครทิศอื่นและมุมอาคาร/วัตถุคงที่ 2/3 ไม่คูณชุดตัวละครอีกสี่เท่าตามกล้อง

ส่งหนึ่ง PNG ต่อชิ้น/มุม/ชั้น/เฟรม พร้อมต้นฉบับและข้อตกลงใช้งาน ภาพแสดงในเอกสารนี้เป็นข้อกำหนด ไม่ใช่สถานะ approved

## 2. พร็อมป์ร่วม — แนบหน้าคำสั่งรายชิ้นทุกครั้ง

```text
Create one isolated game sprite for Learn-and-Play, a warm, welcoming community workshop. Use the approved reference set for consistent character identity, soft clean outlines, readable shapes, restrained surface texture, and cream/green/wood/gold colors. Orthographic 2:1 isometric view for world objects: vertical edges stay upright; ground-axis edges have a 2 horizontal to 1 vertical slope. Do not use a square 1:1 diamond or a straight front/side camera for furniture.
Transparent RGBA background, no white background and no checkerboard drawn into the image. No words, numbers, prices, logos, formulas, watermarks, ground plane or long baked cast shadow. Ground/contact shadows are separate in the game. Output exactly one requested PNG, not a collage or sprite sheet. Preserve the requested canvas and pixel anchor. If an exact export size cannot be achieved during generation, keep a high-resolution master and export the sprite with the specified canvas/anchor afterward; do not claim the file matches merely because its name contains the size.
```

สไตล์ใช้ desk/เฟอร์นิเจอร์ไม้อุ่นเป็นตัวอย่างร่วมกับ identity ผู้เล่นเดิม ไม่เพิ่ม pixel/noise ต่างกันต่อชิ้น ถ้าจะคงผู้เล่น pixel ให้ตรวจชุดตัวอย่างพร้อมเฟอร์นิเจอร์ก่อน ไม่ใช้รูปคนต่างคนเป็นเฟรมเดิน

## 3. พื้น — ต้องแก้ projection ก่อนรวมเกม

ต้นฉบับสี่ไฟล์อยู่ `Ground/` มี silhouette ใกล้เพชร 1:1 ห้ามนำลงเกม 2:1 ตรง ๆ แล้วเปลี่ยนตรรกะโลกตามภาพ

| ID | reference ต้นฉบับ | ไฟล์ปลายทาง | ขนาด/anchor |
| --- | --- | --- | --- |
| ENV-001 | grass_diamond_tile_cutout.png | grass-tile.png | 128×64 / (64,32) |
| ENV-002 | stone_path_diamond_tile_cutout.png | path-tile.png | 128×64 / (64,32) |
| MAT-001 | floor_material_A_tile_v2_cutout.png | floor-a-tile.png | 128×64 / (64,32) |
| MAT-002 | floor_material_B_tile_cutout.png | floor-b-tile.png | 128×64 / (64,32) |

ใช้ทีละแถว แทน `{MATERIAL}` ด้วย grass / pale stone path / warm floor A / cool floor B ตาม reference:

```text
Redraw the reference as ONE flat {MATERIAL} ground tile for a 2:1 isometric grid. Exact canvas 128x64 pixels, a diamond with vertices at (64,0), (127,32), (64,63), (0,32), center anchor (64,32). Transparent pixels outside the diamond; no bevel, raised slab, outline border, directional text, isolated decorative clumps, or baked shadow. Preserve the material identity and color from the reference, with low-contrast texture that joins neighboring copies without conspicuous seams. This is a projection correction from the source's nearly 1:1 diamond, not a change in the game's metre grid. Output {TARGET_FILENAME}.
```

ตรวจต่อ 3×3 ที่สเกลเกม ขอบไม่เกิดช่องว่าง/เส้นดำจาก texture และ A/B ต่างลายโดยไม่ใส่คำว่าคุณภาพสูงต่ำ ถ้าดัดภาพเก่าต้องตรวจลายหลังบีบด้วย ไม่ถือว่าการ resize อย่างเดียวเป็นงานที่ผ่าน

## 4. ผู้เล่นและ NPC — ทิศและคู่เดินที่ยังขาด

| ID | identity reference ใน Characters/ | prefix ปลายทาง |
| --- | --- | --- |
| CHAR-001 | student_player_160x192.png | player |
| CHAR-002 | CHAR002_160x192.png | seller |
| CHAR-003 | CHAR003_160x192.png | guide |
| CHAR-004 | CHAR004_160x192.png | neighbour |

ทุกคน canvas160×192, foot anchor(80,176) ตัวละครเดียวกันต้องมี `PREFIX-idle-{ne,se,sw,nw}.png` และ `PREFIX-walk-{ne,se,sw,nw}-{01,02}.png` รวม 12 ต่อคน ภาพเดิมสี่คนเป็น reference identity ก่อน; ยังไม่กำหนดว่า suffix ทิศใดผ่านโดยไม่ได้ตรวจหน้าตาจริง

**Idle — ใช้แยกตามคน/ทิศ:**

```text
Use the supplied {CHARACTER_REFERENCE} as the identity reference: same person, outfit, hair, colors and proportions. Draw that person standing still, screen-facing {DIRECTION: NE/SE/SW/NW}, for the warm drawn game reference style. A north-facing pose shows the appropriate back/side; do not always face the viewer. Canvas 160x192 pixels, transparent RGBA, shared foot-contact anchor (80,176), consistent head/body height across all directions, no ground shadow. Output {PREFIX}-idle-{dir}.png. This is one pose of the same character, never a different NPC.
```

**Walk 01 และ 02 — แนบ idle ที่ผ่าน และ walk01 เมื่อทำ02:**

```text
Create walk frame {01 or 02} of the SAME approved {PREFIX} in screen direction {DIRECTION}. Keep canvas 160x192 and foot anchor (80,176), identical identity, costume, body scale, head height, lighting and framing to the approved idle/walk reference. Frame 01 has one leg and opposite arm forward; frame 02 reverses those limbs. The character moves continuously in code: do not shift the whole body across the canvas, grow/shrink the body, move the head dramatically, or add motion blur. Preserve the common foot-contact point. Transparent RGBA, no baked contact shadow. Output {PREFIX}-walk-{dir}-{frame}.png.
```

4方向เป็นทิศจอ Runtime เลือกจากทิศเดินจริงกับมุมกล้อง ไม่ผลิตอีก 4 camera sets ของตัวละคร

## 5. อาคาร — แก้คู่ชั้นและเพิ่มมุม

| ID | source body / roof ใน Buildings/ | canvas / anchor | ฐาน | prefix |
| --- | --- | --- | --- | --- |
| BUILD-001 | material_shop_A_body.png / material_shop_A_roof.png | 384×448 / (192,416) | 3×2 | shop-a |
| BUILD-002 | material_shop_B_body.png / material_shop_B_roof.png | 384×448 / (192,416) | 3×2 | shop-b |
| BUILD-003 | learning_centre_body.png / learning_centre_roof_v2.png | 768×768 / (384,704) | 6×4 | learning-centre |

**Body — ทีละอาคาร/มุม:**

```text
Redraw the SAME building in {BODY_REFERENCE} as a registered body-only layer for camera view {VIEW 0/1/2/3}. Preserve the building identity, wall colors, physical door/window locations and logical footprint {W}x{H} cells. Use orthographic 2:1 isometric projection, upright walls, transparent RGBA, exact canvas {CANVAS}, and the front-most projected footprint contact corner at {ANCHOR}. No roof pixels, ground slab extending the footprint, text, floor plane or baked contact shadow. The roof will be a separate matched layer. For view 0 physical S projects screen SW and E projects SE; view 1 S projects NW and E projects SW; view 2 S projects NE and E projects NW; view 3 S projects SE and E projects NE. A hidden door remains on its original physical wall; do not move it to a visible wall. Output {PREFIX}-body-view-{VIEW}.png.
```

**Roof — แนบ body มุมนั้นที่ผ่านแล้วพร้อม reference หลังคา:**

```text
Create ONLY the matching roof layer for the supplied approved {PREFIX} body in camera view {VIEW}. Exact SAME canvas {CANVAS}, coordinate registration, scale and footprint anchor {ANCHOR} as its body layer. Place the roof where it meets the wall tops when both PNGs are overlaid at the same registered world base; do not place a detached roof at the bottom of its own frame, independently crop it to fit, or redraw the body. Preserve the roof identity from {ROOF_REFERENCE}. Transparent RGBA, no body pixels, labels or shadows. Output {PREFIX}-roof-view-{VIEW}.png and supply a separate body+roof alignment preview for review, without substituting that composite for the two runtime layers.
```

ต้องตรวจ preview ซ้อนก่อนสร้างมุมถัดไป ร้านA/Bปัจจุบันคู่ชั้น canvasต่างกัน ศูนย์canvasเท่ากันแต่ยังไม่ยืนยัน alignment การ resize เต็มกรอบทั้งคู่ไม่แก้ registration

## 6. เฟอร์นิเจอร์ — แก้มุมและเติมทิศ

ทุกทิศใช้กล้องฐานเดียว world x+จอSE, y+จอSW ไม่ใช่ภาพหน้าตรง/ด้านข้างสลับกล้อง

| ID | reference ใน Objects&decoration/ | filename set | canvas / anchor | ฐาน N/S; E/W |
| --- | --- | --- | --- | --- |
| DEC-001 / OBJ-001 | OBJ-001_DEC-001_south.png | desk-{n,e,s,w}.png | 256×256 / (128,224) | 2×1;1×2 |
| DEC-002 | DEC-002_chair_{north,east,south,west}_1x1.png | chair-{n,e,s,w}.png | 128×192 / (64,176) | 1×1 |
| DEC-003 | DEC-003_bookshelf_{north,east,south,west}.png | shelf-{n,e,s,w}.png | 256×384 / (128,352) | 2×1;1×2 |
| DEC-004 / OBJ-004 | OBJ-004_bench_2x1_south.png | bench-{n,e,s,w}.png | 256×256 / (128,224) | 2×1;1×2 |
| DEC-005 | DEC-005_plant_1x1.png | potted-plant.png | 128×192 / (64,176) | 1×1 |

เก้าอี้/ชั้นชื่อทิศครบแต่ต้องแก้มุมและตัวของร่วมกัน โต๊ะ/ม้านั่งมี S ตัวอย่างแต่ต้องตรวจฐานและเพิ่ม N/E/W:

```text
Draw the SAME {OBJECT} from {REFERENCE} as an isolated furniture sprite, facing logical {N/E/S/W}, under a FIXED orthographic 2:1 isometric camera (world east projects screen SE, world south projects screen SW). N front points screen NE, E front points SE, S front points SW, W front points NW. Keep the object's design and proportions identical across directions. For shelves/chairs, show the correct back side when appropriate; never redraw the front of the shelf in every direction. The footprint is {FOOTPRINT} cells, independent of sprite height. Exact canvas {CANVAS}, front-most projected footprint contact anchor {ANCHOR}, transparent RGBA, no floor patch, labels or contact shadow. Use the approved companion directions as references. Output {TARGET_FILENAME}.
```

ต้นแบบของฟรีมี 2 เก้าอี้/2 กระถาง แชร์ texture ได้ ไม่ผลิตสำเนาชิ้นเดียวเพิ่มเพื่อให้เท่าจำนวนที่วางในโลก

## 7. ต้นไม้/ธง — แก้คู่เฟรมก่อนเพิ่มจำนวน

**Tree** 192×320 / (96,288), reference ENV-003_tree_frame01.png ใช้ทรงต้นนี้เป็นฐาน:

```text
Create tree frame {01/02}, exact canvas 192x320, contact anchor (96,288), transparent RGBA, using the approved tree frame 01 reference. Keep trunk, roots, bottom contact pixels and overall canopy height/width identical. In frame 02 move only a few leaves or small branches subtly; do not rescale or move the tree, shrink the canopy, change species or redraw the trunk. No ground shadow. Output tree-{frame}.png. The current source frame 02 has a substantially smaller canopy and must be corrected rather than used as a breathing/shrinking animation.
```

**Cloth/flag** 128×192 / (64,176), reference ENV-004_flag_frame01_final.png:

```text
Create flag frame {01/02} in camera view {VIEW}, exact canvas 128x192, contact anchor (64,176), transparent RGBA. Preserve the SAME pole and base at the exact same pixels in both frames; keep cloth dimensions and its attachment height fixed. Change only the free cloth edge and folds very subtly for frame 02. Do not shorten the pole, lower the entire cloth, move the base or shrink the object. For new views use the physical-to-screen camera mapping from the building prompt. No letters, logo, ground shadow or floor. Output cloth-{frame}-view-{VIEW}.png.
```

เริ่ม view0สองเฟรมก่อน view1–3 reduced motion ใช้frame01 ไม่ทำให้ผู้เล่นเสียสิทธิ์

## 8. วัตถุคงที่ที่ต้องตรวจมุมกล้อง

| reference ใน Objects&decoration/ | prefix target | canvas/anchor |
| --- | --- | --- |
| OBJ-002_chest_2x1.png | storage | 256×256 / (128,224) |
| OBJ-003_sign_1x1.png | project-sign | 128×192 / (64,176) |
| OBJ-005_board_2x1.png | work-board | 256×320 / (128,288) |
| OBJ-006_portfolio_2x1.png | portfolio-board | 256×320 / (128,288) |

```text
Create camera view {VIEW 0/1/2/3} of the SAME {OBJECT} in {REFERENCE}. Preserve its physical front and proportions; the camera changes, the object's world orientation does not. Use orthographic 2:1 projection and the camera direction table in the building prompt. Exact canvas {CANVAS}, footprint contact anchor {ANCHOR}, transparent RGBA. Leave sign/board surfaces blank for code-rendered readable Thai labels. No baked letters, numbers, image thumbnails, ground patch or shadow. Output {PREFIX}-view-{VIEW}.png.
```

ของทิศสมมาตรอาจใช้ภาพร่วมได้เมื่อพิสูจน์จริง ไม่ลดจำนวนภาพจากชื่ออย่างเดียว Storage interactionอยู่ด้านNตามผัง; ไม่ย้ายจุดยืนตามหน้ากล่องที่เห็น

## 9. เกณฑ์ส่งคืนและตรวจรับ

ส่งไฟล์ตามชื่อ พร้อม asset ID / reference / prompt revision / มุม / เฟรม / canvas / anchor / สิทธิ์ที่ได้รับ ใช้ภาพทับ footprintและคู่body+roofเป็นหลักฐาน ตรวจตรงมุม/ตัวของก่อนขนาด ความละเอียดสูงที่เก็บเป็น master ไม่ใช่เหตุผลต้องโหลดทั้งไฟล์เข้าเกม

สถานะ: incoming → needs revision หรือ approved หลังตรวจ → integrated หลังทดสอบจริง ยังไม่มีภาพใหม่ที่ผลิตจากใบงานนี้ รอชุดเล็กก่อนขยาย ไม่สั่งสร้างทั้งหมดจากยอด83/119อัตโนมัติ
