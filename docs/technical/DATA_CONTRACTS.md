# สัญญาข้อมูลต้นแบบ
ฉบับออกแบบ 0.2 — 9 ตุลาคม 2026; ยังไม่มี TypeScript/runtime validator
อ่านร่วมกับ [กติกา](../game-design/PROTOTYPE_RULES.md) และ [ความยาก](../game-design/DIFFICULTY.md)

## ขอบเขต
เตรียม GUIDED และ INDEPENDENT ก่อน งาน COMPARE/SHAPE/OPEN มีสถานะ planned และห้ามปรากฏเป็นกิจกรรมพร้อมเล่น สัญญานี้เป็นข้อกำหนดให้เขียนโค้ดต่อ ไม่ใช่ระบบเซฟที่ทำแล้ว

## เอนทิตีและเจ้าของข้อมูล
| เอนทิตี | ข้อมูลขั้นต่ำ | ข้อบังคับ |
| --- | --- | --- |
| Subject | id, version, title, graderKind | math ก่อน; วิชาอื่นใช้ตัวตรวจเฉพาะ |
| Objective | id, subjectId, version, prerequisites, source, reviewStatus | แหล่งหลักสูตรยังไม่ตรวจใช้ unverified |
| TaskDefinition | id, version, subjectId, skillIds, context, parameters, responseKind, graderKind, toolsAllowed, assistanceOffered, complexityTags, openness, timePolicy, rubricVersion, availability | แยก planned/ready; เนื้อหาเก่าไม่เขียนทับ |
| Project | id, goal, status, resumeStatus, attemptIds, currentAttemptId | paused ต้องมี resumeStatus |
| ProjectAttempt | id, projectId, taskSnapshot, budget, lots, floor, layout, planRevisionIds | รีเซ็ตสร้างใหม่ ไม่รีเซ็ตผลประเมิน |
| PlanRevision | id, attemptId, createdAt, dataSelection, principle, calculation, check, choiceReason | เก็บแผนแรก/ใช้จริง; ข้อความไม่ใช่คะแนน |
| PurchaseLot | id, materialId, capacityPerBox, unitPrice, purchasedBoxes, returnedBoxes, sealedBoxes, openedBoxes | ราคา ณ ซื้อ; returned + sealed + opened = purchased |
| MaterialBalance | materialId, openedUnused, placed | รวมล็อตของชนิดเดียวกัน; ห้ามปริมาณติดลบ |
| AssessmentAttempt | id, taskSnapshot, submittedWork, helpUsed, toolsUsed, revisions, resultsByDimension, reviewStatus | draft/submitted/partially_pending/reviewed; submittedWork หลังส่งเป็น snapshot |
| DimensionResult | dimensionId, status, verdict, evidenceRefs, reviewer, reviewedAt | unchecked/pending/checked; คะแนนไม่ทราบใช้ null ไม่ใช่ 0 |
| Evidence | id, assessmentAttemptId, subjectId, skillId, claim, conditions, confirmationStatus | pending ไม่ใช่ confirmed; ไม่มีสูตร mastery threshold ในฉบับนี้ |
| PortfolioWork | id, projectSnapshot, assessmentRefs, editableCaption, reflection, coverRef, version | แก้ caption ไม่แก้หลักฐาน; แก้โครงการสร้างฉบับใหม่ |
| UnlockGrant | id, ruleId, ruleVersion, evidenceRefs, grantedAt | ใช้สิทธิ์เฉพาะกฎที่ตรวจแล้ว; key ผู้เล่น + กฎ + ขอบเขตป้องกันซ้ำ |

## หน่วยและความแม่นยำ
พื้นที่ใช้จำนวนเต็ม cm²; 1 m² = 10,000 cm² อัตราร้อยละใช้ basis points (10% = 1,000/10,000) เงินต้นแบบเป็นเหรียญเต็ม จำนวนกล่องเป็นเต็มบวก พิกัดเซลล์เป็นเต็ม
พื้นที่ฐาน 240,000 cm²; เผื่อ 24,000; เตรียม 264,000 A กล่องละ15,000; B20,000 ปัดจำนวนกล่องขึ้นหลังหาร ไม่ปัดพื้นที่ก่อน
หากฉบับอื่นให้เงินทศนิยม ต้องกำหนดหน่วยย่อย/กฎปัดเงินก่อนเปิดใช้ ไม่ใช้กฎเหรียญเต็มนี้กับส่วนลดทุกกรณี

## ข้อมูลความยากและการช่วย
assistanceOffered บอกสิ่งที่เข้าถึงได้; helpUsed เก็บ hintId, level, openedAt, taskStep และ attemptId แยกจากกัน ไม่ถือว่าเปิดปุ่มช่วยแล้วใช้ทุกระดับ
เครื่องมือเก็บชนิด/เวลา/ขั้นที่ใช้ เครื่องคิดเลขไม่ทำให้เหตุผลผ่านอัตโนมัติ timePolicy ของสองงานแรกคือ untimed; ไม่มีคะแนนจากความเร็ว
การเปลี่ยนความช่วยเก็บเหตุการณ์ในงานเดิม เปลี่ยนโจทย์/ความซับซ้อนสร้าง attempt ใหม่พร้อม snapshot ใหม่

## ธุรกรรมและความสอดคล้อง
คำสั่งประกอบด้วย commandId, attemptId, expectedRevision, kind, payload; ผลประกอบด้วย eventId, newRevision, outcome และ snapshot/reference
ตรวจ revision/กติกาก่อนเขียน IndexedDB transaction เดียวที่รวมเงิน ล็อต วัสดุ และ command ledger คำสั่งเดิมซ้ำคืนผลเดิม ไม่หักเงินซ้ำ หากล้มเหลวห้ามเขียนบางส่วน
- buy: ตรวจจำนวนเต็มบวก/เงิน; สร้างล็อตราคาเดิมและหักงบ
- return_sealed: คืนได้ไม่เกิน sealed; เพิ่ม returned ลด sealed คืนตามราคาล็อต
- open_boxes: ลด sealed เพิ่ม opened เพิ่ม openedUnused ตามความจุ
- place_floor/remove_floor: ย้ายปริมาณระหว่าง openedUnused กับ placed; ไม่สร้างเงินหรือกล่องปิด
- reset_attempt: เก็บงานเก่า สร้างการทดลองใหม่ในโครงการเดิม ไม่คัดลอกวัสดุ/เงิน/รางวัลเพิ่ม
- submit_assessment: เก็บคำตอบ/เงื่อนไข/การช่วย; ตัวตรวจคำนวณไม่เติมผลเหตุผล
- store_portfolio: เก็บ snapshot ฉบับที่ตรงผลงาน; ไม่ให้ mastery จากการบันทึก
- grant_unlock: ตรวจผลยืนยันที่กฎต้องใช้และ grant key; เกณฑ์ยังไม่กำหนดให้ปิดการให้สิทธิ์ตาม mastery

ข้อสมดุลต่อชนิด: netPurchasedCoverage = sealedCoverage + openedUnused + placed โดย netPurchasedCoverage รวม purchased−returned ทุกล็อต ใช้ตัวตรวจเดียวกันหลังทุก mutation และ import
ค่าใช้จ่ายสุทธิ = Σ((purchased−returned)×unitPrice); budgetRemaining = initialBudget−netCost
สำเร็จโลกคำนวณจาก floor/สำรอง/งบ/ทางใช้งาน/ภาพ/สรุป ไม่อนุมานจาก status ที่นำเข้า งานไม่ครบใช้รายการเหตุผล ไม่แก้ข้อมูลเอง

## ขอบเขตตัวตรวจวิชา
world ส่ง taskSnapshot + submittedWork + help/tools ให้ grader ตาม graderKind; รับ resultsByDimension + evidenceRefs + reviewStatus ไม่ให้ grader หักเงินหรือแก้โลก
ตัวอย่างจำลองวิชาอื่น: subjectId `language-mock`, graderKind `manual-rubric`, responseKind `text`, dimension `interpretation`, status `pending`, verdict null ใช้ทดสอบโครงสร้างเท่านั้น ไม่ใช่บทเรียนภาษาที่พร้อมเล่น
shared portfolio/mastery อ่านหลักฐานและเงื่อนไข ไม่ hard-code สูตรพื้นที่ไปทุกวิชา

## ตรวจรับเมื่อเริ่มเขียนโค้ด
ทั้ง A/B ผ่าน; คืนเกินถูกปฏิเสธ; คืนกล่องปิดหลังปูจนสำรองไม่พอต้องเปลี่ยนผลโลก; ถอนไม่สร้างกล่อง; ซื้อซ้ำ command เดิมไม่หักซ้ำ; เซฟล้มเหลวไม่ค้างครึ่งรายการ; เหตุผล pending ไม่ให้สิทธิ์; แก้ caption ไม่เปลี่ยนหลักฐาน; โหลดงานเก่ายังใช้ taskSnapshot เดิม

## ข้อชี้แจงจากการทบทวน 9 ตุลาคม 2026
Task snapshot ต้องเก็บ responseKind/graderKind ณ เริ่มงาน ไม่ใช้ตัวตรวจจาก subject รุ่นปัจจุบันแทนงานเก่า ตัวอย่างออกแบบเดิมยังไม่ครบสองช่องนี้และต้องปรับก่อนเป็น fixture ของ runtime
DimensionResult.evidenceRefs ในตัวอย่างหมายถึง ID ของ assessment ต้นทาง ส่วน Evidence.assessmentAttemptId เชื่อมหลักฐานสรุปกลับไป assessment; อย่าตีความ evidenceRefs เป็น Evidence.id โดยอัตโนมัติ ระยะ runtime ควรเพิ่ม reference แบบระบุชนิดและช่องคำตอบที่ตรวจ
verdict numeric-fields-correct ยืนยันเฉพาะช่องตัวเลข ไม่ยืนยันคำอธิบายการตรวจครบด้าน calculate-check; ด้านที่ยังไม่มีหลักฐานต้องระบุรอตรวจหรือขอข้อมูลเพิ่ม
อ่าน [ผลทบทวนและงานถัดไป](CONTINUATION_REVIEW.md) ก่อนเปลี่ยนสัญญานี้เป็นโค้ด

## ข้อมูลเสนอจากหน้าจอและการตรวจครบวงจร
Objectiveเพิ่มindicatorLinksหลายค่าและprocessReferencesตามFIRST_UNIT_ALIGNMENT; Cartอ้างplanRevisionIdและบอกtotalplanต่างจากยอดเงินlive; assessmentเก็บfeedbackViewedAt/priorExposureและreferenceการเปิดบทระหว่างactiveattempt; numericFieldChecksแยกreasoningReviewStatus; PortfolioWorkเพิ่มdraft/final, previousVersionRefและแผนแรก/จริง; worldgrantมีlocalProfileId/ruleVersion/scopeและsnapshotRefs เพื่อatomicstore/grant ข้อมูลทั้งหมดเป็นdesign ต้องเลือกschema/runtimeversionและปรับfixtureก่อนใช้จริง ไม่อ้างว่าช่องใหม่อยู่ในSAVE_EXAMPLEเดิมแล้ว

## Implemented preparation for E6 (9 Oct 2026)

Runtime `PlanRevision` in src/domain/project.ts stores immutable copies of plan, savedAt and context{remaining,floorMaterial,layout,helpUsed}. Attempts also hold layout/undo/redo and practice lesson IDs. This is an in-memory prototype shape, not the final persistence envelope, assessment help contract or a validated import format. Preserve snapshots when adding S4/S5; do not label this as a full portfolio or mastery record.
