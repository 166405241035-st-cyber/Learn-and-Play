# Learn-and-Play

เกมการศึกษา Sandbox คณิตศาสตร์สำหรับนักเรียนมัธยม พร้อมการสอนตรง ๆ การประเมินจากหลักฐาน และพอร์ต

**สถานะ: ต้นแบบเกมที่รันบนเครื่องได้ — โลกเต็มหน้าจอ HUD โครงการ กล้องติดตาม/หมุน สอนเล่น แผน/บทเรียน ร้าน และกติกาวัสดุ**

ยังไม่มีจัดเฟอร์นิเจอร์ ประเมิน พอร์ต รางวัล เซฟ หรือเว็บที่เผยแพร่ ข้อมูลหายเมื่อรีเฟรช

## เริ่มบน Windows

เปิด Terminal ในโฟลเดอร์ที่มี `package.json` (Node 22.19.0 ที่ตรวจไว้รองรับ):

```powershell
git pull --ff-only origin main
npm.cmd ci
npm.cmd run dev
```

เปิด URL ที่ Terminal แสดง แล้วลองวางแผน → บทเรียน → ร้าน → ปู/รื้อ/คืนวัสดุ หยุดเซิร์ฟเวอร์ด้วย Ctrl+C

ตรวจโค้ด: `npm.cmd test` และ `npm.cmd run build`

[สถานะจริง แผนถัดไป และรายการที่ผู้ใช้ต้องทำ](docs/roadmap/FIRST_PROTOTYPE_PROGRESS.md)

เริ่มอ่าน [PROJECT_HANDOFF](docs/PROJECT_HANDOFF.md), [AGENTS](AGENTS.md) และ [SETUP_WINDOWS](docs/SETUP_WINDOWS.md)

- [ปรับหน้าหลักเป็นเกมและผลกระทบการหมุนกล้อง](docs/ui/GAME_UI_REVISION.md)
- [แบบหน้าจอครบวงจร](docs/ui/PROTOTYPE_SCREEN_DESIGN.md), [ผังและวัตถุ](docs/game-design/SCENE_OBJECT_SPEC.md), [แผนที่มุมบน](docs/game-design/SCENE_MAP.svg)
- [รายการภาพ/เสียง](docs/art-audio/PROTOTYPE_PRODUCTION.md) และ [ตรวจแบบ/ผลกระทบการแก้](docs/roadmap/DESIGN_REVIEW_AND_CHANGE_IMPACT.md)
- [ตัวชี้วัดชุดแรก](docs/curriculum/FIRST_UNIT_ALIGNMENT.md) และ [ช่องคำตอบ/การตรวจ](docs/curriculum/FIRST_UNIT_ASSESSMENT.md)
- [แผนหลักสูตรคณิตศาสตร์](docs/curriculum/CURRICULUM_MAP.md), [ชุดการเรียนแรก](docs/curriculum/FIRST_LEARNING_UNIT.md) และ [การเชื่อมการเล่น](docs/curriculum/LEARNING_GAMEPLAY.md)
- [ผลตรวจสถานะและงานพัฒนาถัดไป](docs/technical/CONTINUATION_REVIEW.md)
- [แบบออกแบบครบวงจร](docs/game-design/COMPREHENSIVE_DESIGN.md)
- [กติกาต้นแบบ](docs/game-design/PROTOTYPE_RULES.md) และ [ความยาก](docs/game-design/DIFFICULTY.md)
- [สัญญาข้อมูล](docs/technical/DATA_CONTRACTS.md) และ [เซฟ/กู้คืน](docs/technical/SAVE_DESIGN.md)
- [ข้อความหน้าจอ](docs/ui/SCREEN_COPY.md) และ [ตัวอย่างประเมิน](docs/assessment/RUBRIC_EXAMPLES.md)
- [ทะเบียนภาพ](docs/art-audio/ASSET_REGISTRY.md) และ [พร็อมป์สร้างภายนอก](asset-prompts/style/STYLE_SAMPLE.md)

ภาพสร้างภายนอกโดยผู้ใช้ วิชาอื่นเตรียมจุดต่อยอด ยังไม่ผลิตหลักสูตรในต้นแบบแรก
