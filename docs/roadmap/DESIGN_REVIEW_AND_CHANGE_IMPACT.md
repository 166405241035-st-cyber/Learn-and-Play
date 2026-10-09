# ตรวจแบบครบวงจร แผนต้นแบบ และผลกระทบเมื่อแก้

ฉบับเสนอ0.1 — 9ตุลาคม2026; ข้อ1–6เป็นdesign ข้อ7–8เป็นแผนimplementation/pilot ยังไม่มีเกม/testผู้เล่น
ลิงก์: [หน้าจอ](../ui/PROTOTYPE_SCREEN_DESIGN.md), [ผัง/วัตถุ](../game-design/SCENE_OBJECT_SPEC.md), [ภาพเสียง](../art-audio/PROTOTYPE_PRODUCTION.md), [หลักสูตร](../curriculum/CURRICULUM_MAP.md)

## 1. ผลงานตามลำดับผู้ใช้

| ลำดับ | ผลรอบนี้ | สิ่งที่ยังเหลือ |
| --- | --- | --- |
| 1 | PLAN/LESSON layout ช่องและการกลับร่าง/ใช้ตะกร้า | ทดลองUIและความอ่านง่ายจริง |
| 2 | INTRO/WORK/RESULT taskเครื่องมือ/help/submission/exposure | ตัวตรวจจริง; reasoning reviewer/criteria |
| 3 | PORTFOLIO snapshot/draft/history และกฎworld rewardเสนอ | ภาพ/saveจริง; knowledge ruleยังdisabled |
| 4 | grid/roads/static/decor/front/rotation/collision รวมพิกัดแก้ | pathfinding/occlusionในruntime |
| 5 | 83unique image filenames +10audio specs และพร็อมป์กลุ่มรายชิ้น | ผู้ใช้สร้างsampleภายนอก ตรวจและอนุมัติ |
| 6 | casesตัวเลข/ข้อมูล/path/รางวัล/saveและimpactmatrix | runtime tests/pilotยังไม่ทำ |
| 7 | แบ่งsliceพร้อมเกณฑ์เสร็จ | รอคำสั่งเริ่มโค้ดตามลำดับที่ผู้ใช้กำหนด |
| 8 | แผนสังเกตผู้เรียนและปรับ | ยังไม่มีผู้เรียนทดลอง/ผลตรวจครู |

## 2. วงจรตัวอย่างที่ต้องรองรับ

เลือกมุมอ่าน→แปลน4×6→ลองพื้นที่4+6→feedbackชวนดูช่องหน่วย→เรียน→ร่าง24/26.4→เทียบA/B→เลือกA18→ยืนยันซื้อ3240เหลือ760→เปิด16และปู24→จัดเฟอร์นิเจอร์โดยentryไม่ปิด→snapshot/ภาพ/สรุป→world badgeครั้งแรก→C/D→ตัวเลขตรวจและเหตุผลpending→ผูกassessmentกับพอร์ต→save/reload stateเดิม
ผู้เลือกB14ต้องจบได้เช่นกัน: cost3500 remaining500 เปิด12ปู24 sealed2 reserve4 ไม่สมมติว่าคุณภาพดีกว่าA
assessmentทำก่อนสรุปโลกได้ พอร์ตเก็บpendingได้ ไม่เปลี่ยนflowให้ต้องรอตรวจครูก่อนเล่นต่อ

## 3. Casesและผลที่คาดหวัง

| Case | expected result | ระบบที่ต้องร่วมกัน |
| --- | --- | --- |
| A17 | cost3060 remaining940 purchased25.5; floorปู24ได้แต่reserve1.5<2.4 จึงโลกไม่ผ่าน | shop/floor/check/lesson |
| A18หลังปูคืน1sealed | refund180 remaining940 reserve1.5 โลกปัจจุบันต้องปรับ; snapshotเก่าคงเดิม | lots/budget/world/portfolio |
| A18ถอนทั้งหมด | openedUnused24 sealed2=3 รวม27; ไม่สร้างsealedใหม่ | transaction/material/undo |
| A18→ถอน→ซื้อB14ในattemptเดิม | ถ้าคืนsealedA2เหลืองบ1120ยังซื้อB3500ไม่ได้ เพราะAopenedคืนเงินไม่ได้ | recoveryเสนอreset ไม่แก้เงินให้ผ่านเงียบ ๆ |
| reset | attemptใหม่4000และฟรีdecosตามจำนวนเดิม ไม่โอนของ/งบเก่า; evidenceเก่าอยู่ | project/save/rewards |
| ใช้แผนแก้หลังซื้อ | cartอ้างrevisionใหม่ ซื้อจากเงินจริงที่เหลือ; ไม่หักtotalplanซ้ำ | plan/shop/budget |
| ซื้อ/ส่ง/บันทึกพอร์ตซ้ำcommandId | คืนผลเดิม ไม่หัก/สร้างattempt/work/grantซ้ำ | ledger/transaction |
| วางทับentryหรือปิดfrontchair | previewไม่ผ่านพร้อมreason เก็บlayoutเดิม | collision/path/UI |
| เปิดบท/เฉลยขณะassessmentactive | เก็บhelp/exposureตามที่ใช้ ไม่อ้างindependentโดยไม่เงื่อนไข | lesson/assessment/portfolio |
| ดูเฉลยหลังส่งแล้วทำโจทย์เดิม | submittedเดิมคง; งานใหม่มีpriorExposure หรือvariantใหม่ที่ตรวจแล้ว | immutable snapshot/content |
| เหตุผลpending | cardตัวเลขบอกscope ไม่มีmasterygrant | grader/reward/portfolio |
| ภาพcaptureล้มเหลว | เก็บdraft work ลองใหม่ ไม่worldcomplete rewardครบภาพ | media/persistence/reward |
| importJSONเสีย/schemaใหม่/quotaเต็ม | ไม่ทับsaveเดิม แสดงerror/backup;ไม่replayreward | validator/backup/save |
| captionแก้หรือเปลี่ยนห้อง | captionแยก; snapshotเก่าไม่ถูกแก้ ห้องใหม่เป็นversionใหม่ | portfolio/version |
| mocklanguage manual-rubric | ผลpendingแสดงได้ ไม่ใช้สูตรพื้นที่ตรวจtext | grader routing/sharedUI |

casesเป็นexpected design ไม่ใช่ผลruntimeที่ทดสอบแล้ว การตรวจเลข/ลิงก์/ผังด้วยscriptในscratchถ้ามีให้รายงานแยก ไม่อ้างว่าทดสอบเกมผ่าน

## 4. แผนเขียนต้นแบบเมื่อสั่งเริ่มโค้ด

| Slice | ขอบเขต | เกณฑ์ที่ต้องเห็น/ตรวจ |
| --- | --- | --- |
| S0setup | เวอร์ชันจริง Vite/TS/Phaser npm lock enginesและignore | typecheck/buildตามเครื่องมือที่ตรวจ ไม่ทับdocs; ยังไม่มีhost |
| S1domain | units/task/snapshot/plans/lots/material/budgetcommands | A/Bและcasesคืน/ถอน/reset/idempotencyถูก; ไม่มีUIก็ตรวจlogicได้ |
| S2world | gridprojection clickmove/path interaction collisionplaceholder | เดินถึงจุดหลัก; overlayไม่ทะลุ; logical/visualตรง |
| S3learning/shop/build | PLAN/LESSON/hints/cart/wholefloor/decos | เส้นทางเลือก→แผน→ซื้อ→จัด→ตรวจสำเร็จโลก; กลับร่างได้ |
| S4assessment/portfolio | C/D/checkpoints/results/pending/snapshots/worldgrant | help/exposureครบ; ไม่มีknowledgegrantจากnumeric; workversionตรง |
| S5persistence | IndexedDB commandledger media/export/import/migration | reloadทุกขั้นสมดุล backupก่อนreplace failไม่ทับ;importไม่replay |
| S6integrate/pilot | assetsapproved audio settings mocksubject | 2frameเดินต่อเนื่อง textscale/reducemotion mute; mockrouteถูก |

S1ใช้in-memory transactionต้นแบบได้ก่อนIndexedDBแต่ต้องแสดงข้อจำกัดsaveจริง ไม่อ้างว่าสร้างแล้วจากเอกสาร หลังS5จึงทดสอบปิดbrowser/reloadเต็มชุด โครงสร้างแยกworld/economy/learning/grading/portfolio/rewards/persistence ไม่เพิ่มbackend/login/paidservice

## 5. แผนทดลองและปรับ

เสนอpilotเล็ก4–6ผู้เรียนเป้าหมายที่ระดับพื้นฐานต่างกันและครูทบทวนก่อนขยาย เป็นข้อเสนอจำนวนเพื่อเก็บUX ไม่ใช่ตัวอย่างพิสูจน์ประสิทธิผล
ให้ภารกิจสร้างพื้นที่และเลือกวัสดุโดยไม่บอกวิธีครบ สังเกตอ่านหน่วย แยก24/26.4 เหตุผลปัด แก้ซื้อไม่พอ หาhelp กลับร่าง ใช้keyboard อ่านpending เปิดพอร์ต และsave/load;ไม่ให้รางวัลการเรียนจากเวลาสั้น
บันทึกจุดติด/คำถาม/การช่วยจริง/ข้อผิดและการแก้ เวลาเป็นUX metricเฉพาะเมื่อเก็บอย่างเหมาะสม ไม่ใส่ข้อมูลระบุตัวผู้เล่นในpublicgit ครูดูบทสอน/โจทย์/rubricและหลายทางเลือกC/D
จัดปัญหา: P0เงิน/วัสดุ/หลักฐานเสียหรือclaimผิด;P1เดิน/อ่าน/กู้คืนไม่ได้;P2layout/ข้อความ/ความสวย แก้P0/P1ก่อนเพิ่มหลักสูตร ผลpilotไม่ยืนยันcausal learninggain

## 6. เมื่อผู้ใช้ขอแก้ ต้องบอกผลกระทบ

| การแก้ | สิ่งที่ต้องแก้ตาม | สิ่งที่ต้องตรวจใหม่ |
| --- | --- | --- |
| เปลี่ยนสี/สไตล์ | palette/prompt/reference/artvariants UIcontrast | contrast/ความอ่าน/ชุดภาพไม่หลุดสไตล์; ไม่เปลี่ยนเฉลย |
| ขยับอาคาร/เพิ่มขนาดฐาน | scene footprint/interaction/path/anchor/prompt/map | reachability/occlusion/protectedroads |
| เปลี่ยนขนาดพื้นที่โครงการ | taskparams/grid/area/allowance/boxes/budgetfeasibility/lesson/assessmentversion | ทั้งวัสดุมีทางออก?ตัวเลข/ทางเดิน/ภาพ; งานเก่าใช้snapshotเดิม |
| เปลี่ยนราคา/งบ/ความจุต่อกล่อง | task/material/version/plan/shop/cases/เฉลย | cost/wholebox/feasibility;lotเก่าคงราคาซื้อเดิม |
| เพิ่มคุณภาพ/ความทนทานวัสดุ | scenarioข้อมูลใหม่/lesson/choice rubric/effectrules | ไม่ใส่claimย้อนหลังลงA/Bเดิม; สิ่งที่วัดเพิ่ม |
| ให้ปูทีละช่องหรือผสมวัสดุ | floorcommands/balances/save/undo/render/rubric/ใหม่version | reserveต่อชนิด/transaction/partialcoverage; ไม่patchเฉพาะUI |
| เปลี่ยนคำใบ้/ลดขั้นบท | helpIDs/levels/lesson/assessmentexposure/rubricversion | ประวัติเก่ายังอธิบายได้; ไม่ลบhelp |
| เปลี่ยนความยาก/เพิ่มจับเวลา | task/time/tools/lesson/assessment/portfolioเงื่อนไข | ไม่เทียบคะแนนตรงต่างเงื่อนไข; ผ่อนเวลาaccessibility; ร่างเก่าคง |
| เปลี่ยนรางวัล/ปลดล็อก | rule/version/grantkey/UX/progress/save/migration | pendingไม่grant/idempotencyและช่วยพื้นฐานไม่ถูกล็อก |
| เปลี่ยนพอร์ต/รูป | editable/snapshot/media/schema/export/privacy | captionไม่แก้ผล; bloblimit/references/ย้อนversion |
| เพิ่มวิชา | objective/lesson/response/grader/dimensions/source | routing/mockและsharedUIไม่hardcodemath; ไม่แทนtextแล้วอ้างcurriculumครบ |

รูปแบบตอบการแก้ครั้งต่อไป: “แก้ตามที่ขอ: … / ต้องปรับตาม: … / ตรวจใหม่: … / กระทบงานเก่า: …” หากขัดเป้าหมายเดิมให้บอกความขัดแย้งและเสนอทางเลือก เช่นคำใบ้ปิดหลังเงินหมดขัดการเข้าถึงเรียน ไม่ทิ้งเป้าหมายเงียบ ๆ
แก้ตัวเลข/กติกาใช้content/taskversionใหม่; เปลี่ยนschemaต้องmigration+backup; เปลี่ยนภาพใช้prompt/assetversion คงหลักฐานsnapshotเดิมและบันทึกdecisionlogทุกครั้งที่มีความหมาย

## 7. ขอบเขตที่ต้องติดป้ายไว้

ออกแบบพร้อมเริ่มprototypeได้โดยใช้placeholder แต่ยังไม่มีdependencies/UI/save/graderจริง สเปกขนาดภาพ/time/pilot/ruleworldเป็นข้อเสนอผู้ใช้แก้ได้ รูปจริงสร้างภายนอก หลักสูตรบางส่วน/criteria/retention/reviewerรอครู ไม่มีhostingหรือaccountพร้อมใช้งานจากรอบนี้

## 8. ผลตรวจเอกสารรอบนี้
ตรวจในscratch: local linksและSVG/JSONถูกต้อง;14staticfootprintsไม่ทับกันหรือprotectedroads ทุกinteractionเดินถึงจากspawn; มีตัวอย่างจัดของเริ่มต้นครบ7ชิ้นที่frontเข้าถึงได้;unique image filenames83;ตัวเลขA17/คืนA/เปลี่ยนBตรงกติกา ทดลองlayoutหนึ่งแบบที่frontเก้าอี้ถูกปิดก็ตรวจพบตามกติกาแล้วปรับทิศตัวอย่าง ผลนี้เป็นการตรวจแบบตรรกะ ไม่ใช่runtimegameหรือpilot
