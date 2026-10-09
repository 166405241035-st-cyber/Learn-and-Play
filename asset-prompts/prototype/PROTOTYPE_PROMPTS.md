# พร็อมป์ชุดต้นแบบภายนอก

ฉบับ1 — readyเฉพาะพร็อมป์ ยังไม่generated/approved/integrated
คัดลอกshared style + specificationรายชิ้นจาก [production](../../docs/art-audio/PROTOTYPE_PRODUCTION.md) + promptรายชิ้นต่อไป ใช้sampleที่ตรวจแล้วเป็นreference ไม่สั่งสร้าง83ภาพในครั้งเดียว

## Shared style

Warm hand-drawn cartoon assets for a friendly secondary-school mathematics sandbox. Simple readable silhouettes, soft clean outlines, restrained texture, cream #F6EEDC, green #79A879, blue #79B7C9, gold #E9BD62 and terracotta #CB8065. Consistent 2:1 isometric projection, upper-left lighting. Transparent RGBA canvas. No text, letters, numbers, formulae, prices, watermark, collage or user interface. No baked cast shadow; contact shadow will be drawn separately in the game. Preserve the specified canvas, lowest footprint anchor and logical footprint; decorative height is separate from the collision base.

World orientation: logical east points screen southeast; logical south points screen southwest. A south-facing furniture front is visible toward screen southwest. Do not confuse logical cardinal directions with screen diagonals.

## Characters — CHAR-001ถึง004

| ID | Promptที่เพิ่มจากshared style |
| --- | --- |
| CHAR-001 | One friendly student player character, casual neutral outfit and small school-themed detail, no handheld props. Full body, 160x192 canvas, feet at (80,176). Start with screen-southeast idle. Leave safe margins. |
| CHAR-002 | One approachable adult material seller, apron over casual clothing, clearly distinct from the student. No written logo or handheld price sign. Same character scale, canvas and foot anchor as the approved player reference. |
| CHAR-003 | One approachable learning guide, neat casual outfit and a small book-themed clothing detail, no floating formulae. Clearly distinct silhouette from seller. Same projection, scale, canvas and foot anchor. |
| CHAR-004 | One friendly community neighbour, everyday clothing, distinct silhouette and clothing palette without implying ability or rank. Same projection, scale, canvas and foot anchor. |

หลังidleSEผ่าน: “Preserve exact face, clothing, proportions, camera and feet anchor from this reference. Create the screen-[NE/SE/SW/NW] idle pose, one separate file.”
หลังidleทิศนั้นผ่าน: “Preserve character identity, scale and anchor exactly. Create screen-[direction] walk frame [01 left-leg-forward / 02 right-leg-forward], with a small alternating arm movement. Do not move the whole body to a different position on the canvas.” สร้างเฟรมแยกและตรวจpairก่อนเพิ่มทิศ อย่าmirrorจนรายละเอียดเสื้อเปลี่ยนด้าน

## Ground — ENV-001/002 และ MAT-001/002

ทุกชิ้น128×64 anchor(64,32) diamond verticesขอบเรขาคณิต(64,0),(128,32),(64,64),(0,32); imagepixelอยู่ช่วง0–127/0–63 เครื่องมือภายนอกต้องตรวจrasterboundary ไม่ต้องใส่ขอบวาดเข้ม

| ID | Prompt |
| --- | --- |
| ENV-001 | One flat seamless grass diamond ground tile. Subtle low-contrast grass texture. Transparent outside the diamond. No plants, walls, raised edges or shadows. |
| ENV-002 | One flat seamless pale stone path diamond tile. Fine simple stone texture without heavy borders or directional arrows. Transparent outside the diamond. |
| MAT-001 | One flat floor material A diamond tile, light warm simple repeating geometric pattern. No quality labels. Match scale and edge continuity of the grass reference. |
| MAT-002 | One flat floor material B diamond tile, slightly cooler simple repeating geometric pattern, equally clean and readable as A. Do not imply greater durability or luxury. |

## Buildings — roof/bodyต้องแยก

| ID | Prompt |
| --- | --- |
| BUILD-001 | One small material shop A, 3x2 logical cells, south-facing entrance visible toward screen southwest. 384x448 canvas, lowest footprint anchor (192,416). Friendly warm timber and cream facade, blank sign area. Generate the aligned body layer and roof layer as separate files using the approved whole-building reference. Body must remain complete when roof is hidden. |
| BUILD-002 | One small material shop B with the exact same 3x2 footprint, camera and scale as shop A, blue-green trim and a different blank awning pattern. Same 384x448 canvas and (192,416) anchor. Separate aligned body and roof files. No lettering or implied quality advantage. |
| BUILD-003 | One welcoming learning centre, 6x4 logical cells, south-facing entrance. 768x768 canvas, lowest footprint anchor (384,704). Cream facade, green roof, clear doorway and blank sign. Separate aligned body and roof files, no lesson content or numbers painted onto the building. |

หากบริการสร้างlayersตรงกันไม่ได้ สร้างreferenceอาคารก่อนแล้วแยกlayersภายนอก โดยตรวจว่าcanvas/anchorไม่เปลี่ยน ห้ามอนุมัติroofที่ตำแหน่งเหลื่อม

## Objectsและdecoration

ใช้canvas/anchorตามproduction แต่ละpromptสร้างหนึ่งไฟล์ วัตถุที่หมุนใช้logicalvariantn/e/s/wตามfootprint ห้ามหมุนภาพเฉียงเป็นbitmap90°

| ID | Prompt |
| --- | --- |
| OBJ-001/DEC-001 | One small friendly wooden planning desk, logical south-facing, footprint2x1. Blank clean surface with no measuring marks or letters. 256x256 canvas, lowest base anchor(128,224). For each later direction preserve dimensions, wood detail and projection; north/south footprint2x1, east/west1x2. |
| OBJ-002 | One low wooden material storage chest, footprint2x1, no text or visible inventory counts, no loose material spilling beyond the base. 256x256 anchor(128,224). Accessible from either long side. |
| OBJ-003 | One short friendly project sign on a post, blank readable board, footprint1x1. 128x192 anchor(64,176), no letters. |
| OBJ-004/DEC-004 | One simple two-seat wooden bench, south-facing, footprint2x1. 256x256 anchor(128,224). Preserve shape and scale for logical north/east/south/west variants; east/west footprint1x2. |
| OBJ-005 | One community work board, footprint2x1, blank notice surface with simple frame and no pasted written content. 256x320 anchor(128,288). |
| OBJ-006 | One portfolio display board, footprint2x1, blank display area and small empty picture-frame shapes, visually distinct from the work board. 256x320 anchor(128,288), no artwork titles or scores. |
| DEC-002 | One small sturdy chair, footprint1x1. 128x192 anchor(64,176). Produce separately the logical north/east/south/west facing variants with a clear seat/front side and identical scale. |
| DEC-003 | One low friendly bookshelf, footprint2x1 south/north and1x2 east/west. 256x384 anchor(128,352). Books may have plain colored spines with no lettering. Create consistent separate facing variants. |
| DEC-005 | One small potted leafy plant, footprint1x1,128x192 anchor(64,176). Compact leaves do not conceal the pot base. No directional text or flowers requiring extra variants. |
| ENV-003 | One compact friendly tree, footprint1x1,192x320 anchor(96,288). Frame01 and02 separate: trunk/base fixed; only slight leaf sway, identical canopy volume and outline identity. No baked shadow. |
| ENV-004 | One small decorative cloth flag on a short pole, footprint1x1,128x192 anchor(64,176). Two separate subtly fluttering frames; pole and base fixed, no symbols or lettering. |

## Review recordต่อไฟล์

id/variant/frame, promptVersion=1, canvas, anchor, footprint/front, source/service/date/usageTerms, originalFilename, expectedFilename, reviewNotes และstatus ต้องตรวจภาพจริงก่อนapproved; ถ้าปรับสเปกในSCENE_OBJECT_SPECให้แก้productionและpromptพร้อมกัน ไม่เขียนทับreferenceที่approvedโดยไม่เพิ่มversion
