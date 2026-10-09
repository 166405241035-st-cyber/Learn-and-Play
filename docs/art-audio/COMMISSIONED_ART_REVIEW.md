# ผลตรวจภาพคอมมิชและรายการแก้ตามสำหรับโค้ด

9 ตุลาคม 2026 · ตรวจชุดอัปโหลด commit `ccf608fc3064993db80a62f5e6c1ec863635801a` · 33 PNG

ต้นฉบับอยู่ใน `asset-prompts/Illustrative image/` เก็บไว้ครบ ไม่แก้/ลบ/เปลี่ยนชื่อในรอบนี้ ตรวจ metadata ของทั้ง 33 ไฟล์และดูภาพรวมรายชิ้น เทียบ [สเปกผลิต](PROTOTYPE_PRODUCTION.md), [พร็อมป์ฐาน](../../asset-prompts/prototype/PROTOTYPE_PROMPTS.md), [พร็อมป์กล้อง](../../asset-prompts/prototype/CAMERA_VIEW_PROMPTS.md) และผัง/ฐานเดิม

**ผล: มีชิ้นที่ใช้ต่อเป็นตัวอย่างได้ แต่ยังไม่ผ่านเป็นชุดพร้อมรวมเกม** มี alpha โปร่งใสครบ 33 ไฟล์; 23 ไฟล์มี canvas ตรงค่าทดลอง ส่วน 10 ไฟล์ (อาคาร 6 + พื้น 4) ขนาดต่างจากค่าทดลอง ต้องแก้มุม/เฟรม/การจัดชั้นเพิ่มเติม ไม่ควรโหลดเข้าระบบแล้วถือว่าหมุนกล้องได้ครบ

นี่เป็น preflight ภาพและไฟล์ ยังไม่ทดสอบการซ้อนชั้น/เดิน/วางใน runtime ไม่ยืนยัน pixel anchor จาก bounding box อย่างเดียว และยังไม่ได้รับข้อตกลงการใช้ภาพเพื่อบันทึกสิทธิ์

## 1. สิ่งที่ตรงและใช้ต่อได้

- ตัวละคร 4 คน: canvas 160×192 ตรง มี alpha และขอบล่างส่วนที่มีภาพถึงแถว 175 ใกล้ระดับเท้าที่กำหนด 176 ใช้เป็น reference หน้าตาแต่ละคนได้; จุดเท้าจริงและทิศต้องตรวจในเกมอีกครั้ง
- ของ 19 ไฟล์: canvas ตรงตามชนิดในสเปก ขอบล่าง bbox อยู่ที่ค่า y anchor ทดลอง ใช้ต่อเป็น style/placement samples ได้ แต่ขอบภาพตรงค่าไม่พิสูจน์ว่า footprint/front ถูก
- เก้าอี้/ชั้นมีชื่อไฟล์ทิศครบ 4 แต่ต้องตรวจความหมายทิศจากภาพ ไม่อนุมัติเพียง suffix ตรง
- อาคารมี body/roof แยกไฟล์เป็นจุดเริ่มต้นที่ดี; ต้องจัด geometry และ registration ของคู่ภาพก่อนใช้จางหลังคา
- สีไม้อุ่นของหลายชิ้นเข้าธีมที่เสนอ แต่ตัวละครออกแนว pixel ขณะที่เฟอร์นิเจอร์/ต้นไม้มีผิวและเส้นแบบวาดนุ่ม ต้องเลือก style reference ร่วมก่อนสั่งเพิ่ม

## 2. จุดไม่ตรงและข้อเสนอแก้

| กลุ่ม | สิ่งที่พบจากไฟล์/ภาพ | ข้อเสนอแก้ | ผลต่อแผนโค้ด |
| --- | --- | --- | --- |
| พื้น 4 ภาพ | รูปเพชรที่เห็นและ bbox กว้าง:สูงใกล้ 1:1; เป้าหมายโลกคือ 2:1 และ tile 128×64 | ให้ทำตัวอย่าง tile 2:1 หนึ่งชิ้นก่อน ตรวจต่อขอบ 3×3; ถ้าจะแปลงภาพเดิมต้องดูตัวอย่างก่อน เพราะลายจะถูกบีบ | โหลดเป็น ground tile ตาม grid เดิม ไม่เปลี่ยน projection/พื้นที่คณิตให้ตามเพชร 1:1 |
| อาคารร้าน A/B | body/roof มี canvas ต่างกันในคู่เดียวกัน และสัดส่วนต่างจาก 384×448 | ปรับส่งออกคู่ให้ canvas/anchor ร่วมกันหรือระบุ transform ที่วัดจริง; ไม่ resize แต่ละชั้นให้เต็มกรอบแบบอิสระ | manifest ต้องระบุ layer registration; roof วางด้านบนผนัง ไม่ใช้จุดฐานเดียวแบบไม่ชดเชยความสูง |
| ศูนย์เรียน | body/roof ทั้งคู่ 1600×1600 แต่ตำแหน่ง silhouette ต่าง; ยังพิสูจน์ซ้อนพอดีไม่ได้ | ทำภาพ preview ประกอบ body+roof ให้เห็นว่าตรงมุมผนังและ 6×4 cells; เป้าหมายทดลอง 768×768 | origin/scale ต้องอิงฐานจริง ไม่ใช้ bbox กลางเป็น origin อัตโนมัติ |
| กล้องหมุน | อาคารและวัตถุคงที่ส่วนใหญ่มีมุมเดียว | ใช้เป็นมุมฐานก่อน แล้วทำคู่ view 0/1 ของอาคารเดียวก่อนขยายครบ 4 | อย่ากลับภาพซ้ายขวาแทนด้านที่ไม่มี; ไม่ย้ายประตู/front cell ตามภาพ |
| ตัวละคร | 4 ไฟล์คนละคน ไม่ใช่ 4 ทิศของผู้เล่น; ยังไม่มีคู่เดิน 01/02 | ระบุทิศภาพจริงของแต่ละคน ส่งผู้เล่นทิศเดียว idle+walk 01/02 เป็นชุดแรก | mapping เป็น character ID → screen direction → animation frame; ห้ามเอา NPC มาแทนเฟรมทิศผู้เล่น |
| เก้าอี้ | บางภาพเป็นมุมตรง/ด้านข้างแทนมุมฉาย 2:1 ร่วม; N/S ต้องตรวจว่าเห็นหน้า/หลังถูก | ทำ reference ทิศ N/E/S/W ภายใต้กล้องฐานเดียวกัน พร้อมลูกศร front | suffix ไม่ถือเป็นความจริงจนตรวจภาพ; front-access และ footprint ไม่เปลี่ยนเพราะรูปด้านข้าง |
| ชั้นหนังสือ | north เห็นหน้าชั้นและหนังสือ ต่างจากการคาดว่าจะเห็นด้านหลังเมื่อหันทิศกลับจาก south; ความสูงที่เห็นต่างกัน | ยืนยันทิศ front โดยวางในแปลน; รักษาตัวตู้/ชั้น/จำนวนช่องร่วมกันทุกมุม | ไม่แก้ direction mapping เพื่อซ่อนชิ้นงานผิดทิศ ต้องบันทึกทิศที่ยืนยันจริง |
| ต้นไม้ 2 เฟรม | bbox บนเปลี่ยน y83→116 ขณะที่ล่างอยู่288; พุ่มและสัดส่วนเปลี่ยนมาก | ลำต้น/ฐานและทรงรวมต้องคงเดิม เปลี่ยนใบเล็กน้อย ไม่ย่อทั้งต้นเป็นเฟรมสอง | ยังไม่เล่นสลับเฟรมเพราะจะเห็นยุบ/พอง; reduced motion ใช้เฟรมแรก |
| ธง 2 เฟรม | bbox บน y26→72 ล่าง176; เสา/ฐานและขนาดผืนดูเปลี่ยน | เก็บเสา/ฐาน pixel เดิม เปลี่ยนผ้าอย่างเดียวใต้ reference เดียวกัน | ยังไม่อนุมัติเป็นคู่แอนิเมชัน ไม่ชดเชยด้วยขยายทั้งภาพเฟรมสอง |
| โต๊ะ/ม้านั่ง/ของคงที่ | มุมเดียว และขนาดภาพไม่ใช่หลักฐานฐาน 2×1 | ทดสอบวางทับ footprint template; โต๊ะ/ม้านั่งยังขาดทิศ N/E/W | ข้อมูลวัตถุมี footprint/front แยกจาก texture; ไม่ใช้ alpha bbox เป็นฐานชน |
| สไตล์ร่วม | ความเป็น pixel/เส้นนุ่ม/ผิวต้นไม้ต่างกัน | เลือกชุดตัวอย่างคน+โต๊ะ+พื้นให้ผู้ใช้ดูพร้อมกันก่อนผลิตเพิ่ม | ไม่ใช้ฟิลเตอร์ย่อ/ขยายแก้ความต่างทั้งหมดโดยไม่มีภาพตัวอย่าง |

ไม่จำเป็นทิ้งทั้งชุด อาคาร/ของ/ตัวละครใช้เป็น reference และชิ้นทดลองได้ การแก้ canvas อย่างเดียวไม่แก้มุมหรือโครงสร้าง; ส่วน alpha ผ่านไม่ได้หมายถึงสิทธิ์ใช้งานผ่าน

## 3. ลำดับแก้ที่ลดงานซ้ำ

1. เลือก style reference ร่วมจากผู้เล่น+โต๊ะ+พื้น และตกลง projection 2:1 ตามเกมเดิม
2. แก้ grass 128×64 ตัวเดียว ตรวจต่อขอบก่อนทำ path/A/B
3. ส่งผู้เล่น idle และ walk 01/02 ทิศเดียว ขนาด/เท้าคงที่
4. แก้ tree/flag คู่เฟรมโดยรักษาส่วนฐาน ไม่เพิ่มทิศทั้งชุดจนคู่แรกนิ่ง
5. ทำ shop A body+roof มุมฐานที่ซ้อนพอดี แล้วมุมที่สองเพื่อพิสูจน์กล้อง
6. ตรวจเก้าอี้/ชั้นทิศจริงและของบน footprint template ก่อนเพิ่มมุมที่ขาด
7. เมื่อผ่านจึงอัปเดตชื่อ runtime/manifest และทดสอบเกมตามแผนที่ได้รับคำสั่งใหม่

ยังไม่ผลิตเพิ่มทันที 83/119 ภาพเป็นประมาณการตามแบบ ไม่ใช่จำนวนส่งแล้วหรือผ่านแล้ว และ 33 ไฟล์นี้ไม่ได้แทน 33 รายการในสเปกได้โดยอัตโนมัติ

## 4. รายการแก้แผนโค้ดใน doc — ยังไม่ implement

ข้อเสนอ schema manifest เพื่อรองรับไฟล์คอมมิชโดยไม่ผูกชื่อดิบกับ logic:

```ts
interface ReviewedSpriteSpec {
  assetId: string;
  sourceFilename: string;
  runtimeFilename: string;
  reviewStatus: 'incoming' | 'needs-revision' | 'approved';
  canvasPx: [number, number];
  anchorPx: [number, number]; // ค่าที่วัดและตรวจแล้ว ไม่เดาจาก bbox
  screenDirection?: 'ne' | 'se' | 'sw' | 'nw';
  cameraView?: 0 | 1 | 2 | 3;
  animation?: 'idle' | 'walk';
  frame?: 1 | 2;
  layer?: 'body' | 'roof';
}
```

- `src/world/WorldScene.ts`: เพิ่ม loader และ sprite rendering หลังอนุมัติชุดตัวอย่าง; เลือกทิศจาก `src/domain/view.ts`, ตั้ง origin = anchor/canvas, scale จาก footprint ที่ตรวจ, depth จากฐานที่ฉาย ไม่จากยอดภาพ
- แยกตำแหน่ง roof ที่ลงทะเบียนกับ body ให้มุม/สเกลเดียวกัน ระยะสูงจากหลังคาต้องมีค่าทดสอบจริงก่อน fade
- `src/content/scene-layout.json`: คง footprint/front และพิกัดโลก; เพิ่ม asset reference เมื่อรู้ mapping จริง ไม่เอาขนาด PNG มาเขียนทับขนาดพื้นที่
- ground: เก็บ tile projection 128×64; ไม่เปลี่ยนพื้นที่ 4×6, สำรอง10%, งบ4000 หรือสูตรเพราะภาพพื้นเป็น 1:1
- ป้าย/สูตร/ราคา/preview/route เป็นโค้ดตามเดิม ภาพบอร์ดใช้ตกแต่งไม่แทนข้อความการสอน
- รักษาต้นฉบับใน incoming/source area และสร้างไฟล์ runtime ชื่ออ่านง่ายในขั้น integration ไม่โหลดไฟล์ความละเอียดใหญ่ทั้งหมดโดยตรงเพียงเพราะอยู่ใน GitHub
- ทดสอบ collider/picking/สี่มุม/roof/focus/reduced motion และภาพตัวอย่างตามลำดับ ไม่อ้างว่าการตรวจ PNG รอบนี้เป็นการทดสอบโค้ด

## 5. บัญชีไฟล์ตรวจจริง

`bbox` = ขอบเขตทุกพิกเซลที่ alpha ไม่เป็นศูนย์ รูปแบบ left,top,right,bottom (right/bottom ไม่รวม) ใช้หาเบาะแส ไม่ใช่ footprint/anchor ที่ยืนยันแล้ว

| ไฟล์ต้นฉบับ | canvas จริง | alpha | bbox | สถานะรอบนี้ |
| --- | --- | --- | --- | --- |
| `Buildings/learning_centre_body.png` | 1600×1600 | 0–255 | 71,234,1540,1340 | incoming; preflight แล้ว ยังไม่ approved |
| `Buildings/learning_centre_roof_v2.png` | 1600×1600 | 0–255 | 55,380,1547,1284 | incoming; preflight แล้ว ยังไม่ approved |
| `Buildings/material_shop_A_body.png` | 1344×1792 | 0–255 | 120,358,1230,1469 | incoming; preflight แล้ว ยังไม่ approved |
| `Buildings/material_shop_A_roof.png` | 1440×1680 | 0–255 | 73,439,1383,1274 | incoming; preflight แล้ว ยังไม่ approved |
| `Buildings/material_shop_B_body.png` | 1376×1824 | 0–255 | 100,332,1280,1519 | incoming; preflight แล้ว ยังไม่ approved |
| `Buildings/material_shop_B_roof.png` | 1328×1552 | 0–255 | 55,400,1285,1182 | incoming; preflight แล้ว ยังไม่ approved |
| `Characters/CHAR002_160x192.png` | 160×192 | 0–255 | 52,16,109,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Characters/CHAR003_160x192.png` | 160×192 | 0–255 | 54,16,106,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Characters/CHAR004_160x192.png` | 160×192 | 0–255 | 49,16,111,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Characters/student_player_160x192.png` | 160×192 | 0–255 | 45,16,115,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Ground/floor_material_A_tile_v2_cutout.png` | 1920×1280 | 0–255 | 335,37,1585,1243 | incoming; preflight แล้ว ยังไม่ approved |
| `Ground/floor_material_B_tile_cutout.png` | 1920×1280 | 0–255 | 405,86,1515,1195 | incoming; preflight แล้ว ยังไม่ approved |
| `Ground/grass_diamond_tile_cutout.png` | 1600×1600 | 0–255 | 168,162,1446,1440 | incoming; preflight แล้ว ยังไม่ approved |
| `Ground/stone_path_diamond_tile_cutout.png` | 1600×1600 | 0–255 | 121,120,1481,1479 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-002_chair_east_1x1.png` | 128×192 | 0–255 | 22,71,107,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-002_chair_north_1x1.png` | 128×192 | 0–255 | 22,42,107,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-002_chair_south_1x1.png` | 128×192 | 0–255 | 23,41,106,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-002_chair_west_1x1.png` | 128×192 | 0–255 | 22,48,107,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-003_bookshelf_east.png` | 256×384 | 0–255 | 23,181,233,352 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-003_bookshelf_north.png` | 256×384 | 0–255 | 23,237,233,352 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-003_bookshelf_south.png` | 256×384 | 0–255 | 23,182,233,352 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-003_bookshelf_west.png` | 256×384 | 0–255 | 23,177,233,352 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/DEC-005_plant_1x1.png` | 128×192 | 0–255 | 19,72,109,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/ENV-003_tree_frame01.png` | 192×320 | 0–255 | 11,83,181,288 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/ENV-003_tree_frame02.png` | 192×320 | 0–255 | 11,116,181,288 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/ENV-004_flag_frame01_final.png` | 128×192 | 0–255 | 20,26,108,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/ENV-004_flag_frame02_v2.png` | 128×192 | 0–255 | 19,72,109,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-001_DEC-001_south.png` | 256×256 | 0–255 | 28,56,228,224 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-002_chest_2x1.png` | 256×256 | 0–255 | 23,71,233,224 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-003_sign_1x1.png` | 128×192 | 0–255 | 19,40,109,176 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-004_bench_2x1_south.png` | 256×256 | 0–255 | 39,54,217,224 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-005_board_2x1.png` | 256×320 | 0–255 | 62,8,195,288 | incoming; preflight แล้ว ยังไม่ approved |
| `Objects&decoration/OBJ-006_portfolio_2x1.png` | 256×320 | 0–255 | 13,25,243,288 | incoming; preflight แล้ว ยังไม่ approved |

ที่มา/ข้อตกลงการใช้ภาพและการทดสอบ runtime ยัง pending ทุกไฟล์ จึงไม่มีรายการ integrated ในรอบนี้
