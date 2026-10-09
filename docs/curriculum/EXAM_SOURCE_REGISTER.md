# ทะเบียนแหล่งข้อสอบและเกณฑ์รับเข้า

ตรวจ 9 ตุลาคม 2026 · เก็บลิงก์และการวิเคราะห์ของโครงการ ไม่คัดลอกชุดPDFเข้าคลัง

| source_id | ต้นทาง / ประเภท | สิ่งที่ตรวจได้ | ใช้ได้ / สิ่งที่ยังใช้ไม่ได้ |
| --- | --- | --- | --- |
| TC68-M1 | [MyTCAS Math1 2568](https://assets.mytcas.com/68/answer/tcas68-math1-a-level.pdf) / actual_official | ชุดจริงพร้อมเฉลย; ตรวจภายใน30ข้อในเอกสารเดิม | อ้างทักษะ/ฝึกวิเคราะห์; ครูยังไม่รับรอง ไม่มีชุดประเมินลับเพราะเฉลยเปิดแล้ว |
| TC68-M2 | [MyTCAS Math2 2568](https://assets.mytcas.com/68/answer/tcas68-math2-a-level.pdf) / actual_official | รหัส62 วันที่10มีนาคม2568 PDF21หน้า30ข้อ; เฉลยหน้า21ให้คะแนนทุกคำตอบข้อ4/9 | ลงทะเบียน30ข้อ ตรวจแก้12ข้อ; กัน4/9จากประเมินและสถิติตอบถูก อีก16ข้อรอแก้ |
| BP-M1 / BP-M2 | [Math1](https://www.mytcas.com/blueprint/a-level-61-math1/), [Math2](https://www.mytcas.com/blueprint/a-level-62-math2/) / blueprint_and_official_sample | โครงสร้างและตัวอย่าง ไม่ใช่ชุดจริงปีเดียวกับTC68โดยอัตโนมัติ | ใช้กำหนดขอบเขต แยกitemประเภทsampleจากactual |
| M4-TU-PUB-01 | [ตะลุยโจทย์คณิต สอบเข้า ม.4 เตรียมอุดมฯ](https://bundanjai-static.reeeed.com/book/cm9iql8t52xlc0789y495mqhl/preview/8859099309325PDF.pdf?supportedpurview=project) / publisher_practice_preview | เปิดPDF29หน้า; PDFหน้า2ระบุไตร อัญญโพธิ์, ธิงค์ บียอนด์ บุ๊คส์, พิมพ์2565 และe-bookพฤศจิกายน2567; คำนำระบุแนวโจทย์ | เพิ่มแหล่งที่ระบุชื่อ/ผู้ผลิตได้; ไม่ใช่ข้อสอบจริงโรงเรียน และไม่ใช้ข้อความจำนวนวิชา/ข้อในคำนำเป็นประกาศสอบปัจจุบัน |
| M4-MW-PUB-01 | [Math MWIT](https://bundanjai-static.reeeed.com/book/cm9iqkghj2x5x0789iatmke20/preview/8859099309233PDF.pdf?supportedpurview=project) / publisher_practice_preview | เปิดPDF30หน้า ชื่อเอกสารตรงMath MWIT; ยังไม่ได้อ่านข้อมูลผู้เขียน/ปี/เฉลยรายข้อครบ | รับเข้าระดับแหล่งแนวโจทย์ที่เปิดได้เท่านั้น รายข้อพักจนตรวจภาพและเฉลย ไม่อ้างMWITเผยแพร่เอง |
| M4-PUB-OLD | [Serazu preview](https://serazu.com/web/download/link-file?id=890) / publisher_practice_preview | ตัวอย่าง15หน้า ตามทะเบียนเดิม | เก็บไว้ไม่ยกระดับเป็นactual ดู[M4_SOURCE_REVIEW](M4_SOURCE_REVIEW.md) |
| M4-TU / MW / KV-OFFICIAL | [เตรียมอุดม](https://www.triamudom.ac.th/), [MWIT admission](https://apply.mwit.ac.th/), [KVIS admission](https://admission.kvis.ac.th/) / admission_information | เว็บไซต์/ประกาศของโรงเรียน; [ประกาศKVIS2570](https://admission.kvis.ac.th/th/articles/show?id=14) พบในการค้นรอบนี้ | ใช้ยืนยันโรงเรียนและตามหาชุด ไม่ใช่ข้อสอบ; ยังไม่มีชุดจริงของสามโรงเรียนที่รับรองต้นทางได้ |
| LP-ORIGINAL | บทAVG/RP แบบA/B/C/D และT1–T4 / project_original | โครงการแต่งและเปิดคำตอบในrepo | ใช้สอน/ตรวจภายใน; ประเมินได้เฉพาะคนที่ไม่เคยเห็นและบันทึกexposure ไม่ติดชื่อโรงเรียน |

## ระเบียนรายข้อที่ต้องเก็บก่อนนำมาใช้

`item_id, source_id, source_type, exam_year, booklet, question_no, pdf_page, printed_page, source_url, checked_date, skill_ids, prerequisite_ids, curriculum_ref, original_key, local_solution_status, visual_check_status, official_correction, difficulty_profile, use_role, exposure_status, rights_status, reviewer, version`

item_id ตัวอย่าง `TC68-M2-S1-Q28`; original_keyต้องแยกจากวิธีแก้ของโครงการ สิทธิ์ยังไม่ยืนยันให้rights_status=unconfirmed ไม่แปลงเป็นpermittedเพียงดาวน์โหลดได้ ระเบียนในเอกสารตอนนี้ยังไม่ใช่ฐานข้อมูลruntime

## ประตูรับข้อ

- ต้นทางตรวจได้และแยกจริง/ตัวอย่าง/แนว/แต่งเอง หากเป็นโจทย์จำจากห้องสอบให้reconstructedและรอที่มา ไม่เป็นactual_official
- อ่านต้นฉบับภาพเมื่อมีกราฟ ตาราง ราก/ยกกำลัง; แก้เองก่อนเทียบเฉลย บันทึกเมื่อเฉลยเปลี่ยน/ยกเลิก
- มีทักษะกับพื้นฐานตรงกันและข้อประเมินถามหลักฐานที่ต้องตรวจ ไม่ให้ชื่อบททำหน้าที่บอกสูตร
- ชุดที่มีเหตุเฉลยผิด/กำกวม/ให้คะแนนทุกคำตอบพักจากการประเมิน โจทย์ที่ต้องสมมติความเท่าเทียมในการสุ่มต้องระบุสมมติฐาน
- การกระจายหมวดจากหนึ่งปีเป็นทะเบียนของปีนั้น ไม่เป็นเปอร์เซ็นต์คาดการณ์หรือข้อสอบเฉพาะมหาวิทยาลัยใด

## ช่องว่าง ม.4 ที่ต้องปิดต่อ

ค้นด้วยชื่อโรงเรียนและโดเมนต้นทางซ้ำรอบนี้ ยังไม่พบชุดจริงคณิตศาสตร์ที่รับรองได้ จึงเพิ่มแหล่งผู้จัดพิมพ์สองรายการแบบระบุสถานะตรงไปตรงมา งานต่อคืออ่านpreviewรายข้อ/เฉลยที่มีและตรวจสิทธิ์; หากไม่มีชุดจริงให้ใช้หลักสูตรกับโจทย์แต่งตรวจคุณภาพโดยติดป้ายชัด ไม่สร้างหลักฐานต้นทางขึ้นเอง
