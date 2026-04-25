# Decisions Needed

เอกสารนี้เก็บเรื่องที่ยังต้องให้ผู้ใช้ตัดสินใจ Codex ห้ามเดาเอง โดยเฉพาะเรื่องที่เกี่ยวกับข้อมูลจริง ความเป็นส่วนตัว การยืนยันตัวตน การให้สิทธิ์ คะแนน และการ deploy

## ตัวตนและเนื้อหา public

- [ ] ชื่อเว็บไซต์สุดท้าย
- [x] ชื่ออาจารย์ที่ต้องการแสดงบนเว็บไซต์: `ดร.สิทธิโชค ทรงสอาด`
- [x] ชื่อภาษาอังกฤษ: `Sittichoke Songsa-ard`
- [x] ตำแหน่งหรือ title: `ผู้ช่วยศาสตราจารย์ สาขาวิชาคณิตศาสตร์`
- [x] ภาควิชา/สาขา: `สาขาวิชาคณิตศาสตร์ คณะวิทยาศาสตร์และเทคโนโลยี`
- [x] มหาวิทยาลัย: `มหาวิทยาลัยราชภัฏสุราษฎร์ธานี`
- [x] email สำหรับเผยแพร่สาธารณะ: `sittichoke.son@sru.ac.th`
- [x] ห้องทำงานสำหรับเผยแพร่สาธารณะ: `อาคารเรียนรวม คณะวิทยาศาสตร์และเทคโนโลยี ชั้น 6 ห้อง δ (เดลต้าเล็ก)`
- [x] รูป profile ที่อนุญาตให้ใช้: ใช้รูปถ่ายที่ผู้ใช้ให้มาและเก็บไว้ใน repo (`public/sittichoke.png`)
- [ ] Google Scholar URL แบบ profile เฉพาะตัว
- [ ] GitHub URL แบบ profile เฉพาะตัว
- [ ] ORCID หรือ research profile URL แบบ profile เฉพาะตัว

หมายเหตุ: ข้อมูล public profile เบื้องต้นได้รับการยืนยันจากผู้ใช้แล้ว หน้า research ใส่ลิงก์ค้นหา Google Scholar, ORCID และ GitHub ไว้ชั่วคราว แต่ยังไม่ถือว่าเป็น profile URL เฉพาะตัวจนกว่าจะพบหรือได้รับ URL ที่ยืนยันได้

## ขอบเขตชื่อระบบรายวิชา

- [x] ระบบนี้ไม่ใช่ระบบกลางของมหาวิทยาลัยหรือคณะ
- [x] ระบบนี้ใช้สำหรับรายวิชาที่อาจารย์สิทธิโชค ทรงสอาด เป็นผู้สอนเท่านั้น
- [x] UI ฝั่งผู้เรียนควรใช้คำอย่าง `รายวิชาของฉัน`, `พื้นที่ผู้เรียนในรายวิชา`, หรือ `พื้นที่รายวิชาของอาจารย์สิทธิโชค`
- [x] หลีกเลี่ยงการใช้คำว่า `ระบบนักศึกษา` ในบริบทที่อาจทำให้เข้าใจว่าเป็นระบบกลางของมหาวิทยาลัย

## ภาษา

- [x] ใช้ Thai-first เป็นค่าเริ่มต้นสำหรับ UI ที่ผู้ใช้เห็นและเอกสารโครงการ
- [ ] จะมี English version เพิ่มภายหลังหรือไม่
- [ ] จะรองรับ Thai + English language switching ภายหลังหรือไม่

การตัดสินใจปัจจุบัน:
ใช้ภาษาไทยเป็นหลัก public website ควรใช้ภาษาไทยเชิงวิชาการที่สุภาพและอ่านง่าย พื้นที่ผู้เรียนในรายวิชาควรสุภาพ เข้าใจง่าย และไม่สื่อว่าเป็นระบบกลางของมหาวิทยาลัย แดชบอร์ดอาจารย์ควรชัดเจนและใช้งานตรงประเด็น

คงคำศัพท์เทคนิคเป็น English เมื่อชัดกว่า เช่น Firebase, Firestore, Authentication, Hosting, Security Rules, CSV และ UID

ห้ามแปล code-critical identifiers เช่น route paths, Firestore document paths, component names, variable names, environment variables, package scripts, CSS class names และ Security Rules logic

## รายวิชา

- [ ] รายวิชาแรกที่จะใช้จริง
- [ ] course code
- [ ] course title
- [ ] รูปแบบ term หรือ semester
- [ ] สื่อการเรียนรู้ใดเปิด public ได้ และสื่อใดต้อง private
- [x] course model รองรับ `courseCode`, `sections`, `status` และ `portalEnabled` สำหรับรายวิชาจริง
- [x] หน้า admin course detail แสดง control summary สำหรับ roster, enrollments, score items และ student scores

หมายเหตุจากข้อมูลภาคเรียน 1/2569:

- [x] ระบบนี้ควรจัดการเฉพาะรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอนและต้องการใช้ในระบบนี้
- [x] ไม่ต้องนำ `พัฒนาการคิด` เข้าระบบรายวิชานี้
- [x] ไม่ต้องนำ `เตรียมสหกิจ` เข้าระบบรายวิชานี้
- [x] รายวิชาแคลคูลัสที่มี 2 section และเรียนร่วมกัน ควรจัดเป็น course เดียวในระบบ แล้วเก็บ section เป็น metadata/enrollment grouping หากจำเป็น
- [ ] ยืนยันชื่อรายวิชาแคลคูลัส รหัสวิชา หน่วยกิต section และตารางเวลาอย่างเป็นทางการจากหน้า registrar

ข้อมูลจาก screenshot หน้า registrar ปีการศึกษา 2569 ภาคการศึกษาที่ 1:

| รหัสวิชา | รายวิชา | กลุ่ม | รุ่น | กลุ่มผู้เรียน | จำนวนรับ | ลงแล้ว | สถานะใน portal |
| --- | --- | --- | --- | --- | ---: | ---: | --- |
| GESC102 | การพัฒนาการคิด | N09 | 68 | 68310.531 เทคโนโลยีอุตสาหกรรม เทียบโอน | 38 | 28 | ไม่จัดการใน portal |
| SCI0007 | วิทยาการคำนวณและการประยุกต์ใช้ปัญญาประดิษฐ์ | N01 | 69 | 69312.041 คณิตศาสตร์ | 40 | 0 | รอตัดสินใจ |
| SMA2106 | กลยุทธ์และการคิดเชิงวิเคราะห์ผ่านบอร์ดเกม | X01 | - | - | 35 | 35 | รอตัดสินใจ |
| SMA2301 | การวิเคราะห์เชิงคณิตศาสตร์ | N01 | 67 | 67304.041 คณิตศาสตร์ | 38 | 33 | รอตัดสินใจ |
| SMA2401 | รากฐานเรขาคณิต | N01 | 68 | 68301.041 คณิตศาสตร์ | 32 | 3 | รอตัดสินใจ |
| SMA5001 | การเตรียมสหกิจศึกษา | N01 | 66 | 66045.041 คณิตศาสตร์ | 26 | 9 | ไม่จัดการใน portal |
| SMA6001 | สัมมนาคณิตศาสตร์ | P01 | - | - | 15 | 13 | รอตัดสินใจ |
| SMA6002 | โครงงานคณิตศาสตร์ | N01 | 66 | 66045.041 คณิตศาสตร์ | 31 | 10 | รอตัดสินใจ |
| SMA7005 | ปัญญาประดิษฐ์เบื้องต้น | N01 | 66 | 66045.041 คณิตศาสตร์ | 26 | 20 | รอตัดสินใจ |
| SMAC001 | แคลคูลัส 1 | P01 | - | - | 14 | 11 | จัดเป็น course เดียวร่วมกับ P02 |
| SMAC001 | แคลคูลัส 1 | P02 | - | - | 20 | 16 | จัดเป็น course เดียวร่วมกับ P01 |

หมายเหตุ: ตารางนี้เป็น metadata รายวิชาและจำนวน aggregate จาก screenshot เท่านั้น ไม่ใช่รายชื่อนักศึกษาและไม่ใช่คะแนน

## ตารางสอนและช่วงเวลานัดหมาย

- [x] แสดงตารางสอนภาคเรียนที่ 1/2569 ในหน้า Contact เพื่อช่วยให้นักศึกษาเลือกช่วงเวลานัดหมาย
- [x] ระบุช่วงที่ไม่มีตารางสอนประจำเป็นช่วงที่อาจนัดหมายได้
- [x] ตารางสอนใช้ slot เริ่มที่ 08:30 และขยับทีละ 1 ชั่วโมง เช่น 08:30-09:30
- [x] คาบเช้าทุกวิชาเริ่ม 08:30
- [x] ข้อความในหน้าเว็บต้องย้ำว่านักศึกษาควรติดต่อยืนยันล่วงหน้าก่อนเสมอ
- [ ] ยืนยันว่าตารางสอนจาก screenshot เป็นตารางล่าสุดหลังเพิ่ม-ถอนหรือยัง

## Authentication

- [ ] ใช้ Google sign-in อย่างเดียวหรือไม่
- [x] local QA ใช้ Firebase Auth Emulator + email/password fake accounts แทนการสมัคร Google accounts จริง
- [ ] production ต้องรองรับ email/password หรือไม่
- [ ] ต้องจำกัด university email domain หรือไม่
- [ ] วิธีสร้าง student accounts
- [ ] initial admin UID
- [ ] วิธีสร้างเอกสาร `admins/{uid}` ครั้งแรก

การตัดสินใจปัจจุบัน:

- Local development และ QA ก่อน preview ใช้ Firebase Auth Emulator + Firestore Emulator
- บัญชีทดสอบเป็นข้อมูลปลอมใน emulator เท่านั้น
- Google sign-in จริงใช้เฉพาะ smoke test ตอน preview และการใช้งานจริง
- Email/password ใน emulator ไม่ใช่ production sign-in method

## Student identity

- [ ] ใช้ email เป็น primary identifier หรือไม่
- [ ] ใช้ studentId เป็น display identifier หรือไม่
- [ ] ใช้ทั้ง email และ studentId หรือไม่
- [ ] วิธี map studentId/email กับ Firebase Auth UID

คำแนะนำปัจจุบัน:
ใช้ Firebase Auth UID เป็น database document ID และเก็บ studentId เป็น metadata เท่านั้น

การตัดสินใจปัจจุบันสำหรับรายวิชาที่มีรายชื่อจาก registrar:

- [x] อาจารย์สามารถเพิ่ม roster ด้วยรหัสนักศึกษา 13 หลัก
- [x] อาจารย์สามารถ import roster CSV ด้วย `studentId`, `section`, `displayName`, `status`
- [x] email นักศึกษาอนุมานจากรหัสเป็น `{studentId}@student.sru.ac.th`
- [x] roster ใช้กันคนนอกก่อนสร้าง enrollment จริง
- [x] เมื่อนักศึกษา login ด้วย email ที่อยู่ใน roster ระบบจึง link เป็น enrollment ด้วย Firebase Auth UID
- [x] score document ID ยังคงเป็น Firebase Auth UID ไม่ใช้ studentId เป็น document ID

## CSV import

- [ ] required CSV columns ที่ต้องใช้จริง
- [ ] score column naming convention
- [ ] วิธีจัดการ missing scores
- [ ] วิธีจัดการแถวของนักศึกษาที่ไม่ได้ enroll
- [ ] ต้องใช้ feedback columns หรือไม่
- [ ] imported score items ควร default เป็น published หรือ unpublished
- [ ] maxScore ควร infer จาก CSV values หรือกำหนดเอง
- [ ] CSV rows ควร match enrollments ด้วย studentId, email หรือทั้งสองอย่าง

ตัวอย่าง CSV format สำหรับอธิบายรูปแบบเท่านั้น:

```csv
studentId,email,displayName,quiz1,quiz2,midterm
65010001,student1@example.com,Alice,8,9,32
65010002,student2@example.com,Bob,7,10,29
```

ข้อมูลตัวอย่างนี้เป็นข้อมูลปลอม ห้ามใช้เป็นข้อมูลนักศึกษาจริง

## Interactive learning activities

- [x] ออกแบบ activity/media ให้เป็น contract กลางเพื่อเสียบสื่อรายวิชาใหม่ได้ง่าย
- [x] แยก learning progress ออกจาก official score
- [x] ใช้ `activityAttempts` และ `studentProgress` เป็น proposal สำหรับ phase ถัดไป
- [x] เพิ่ม `แคลคูลัส 1 ภาษาไทย` เป็น external interactive learning resource สำหรับสื่อฝึกเบื้องต้น
- [x] ผู้ใช้ชอบแนวคิดของสื่อ `calculus1-thai` และต้องการเก็บเป็นต้นแบบสำหรับ interactive learning ในรายวิชา
- [x] ผู้ใช้ต้องการใช้ XP และ badges เป็นเครื่องมือวัดพัฒนาการและการบรรลุ CLOs ของนักศึกษาแต่ละคน
- [x] หน้า `/student` มี dashboard กลางของผู้เรียนสำหรับรายวิชาของอาจารย์สิทธิโชค โดยแสดงจำนวนรายวิชา สถานะ enrollment และพื้นที่ placeholder สำหรับ progress/CLO/XP ที่ยังไม่ถือเป็นคะแนนจริง
- [ ] activity types แรกที่จะนำเข้าระบบ เช่น lesson, interactive graph, quiz, mission หรือ game
- [ ] กิจกรรมใดเป็น practice เท่านั้น และกิจกรรมใดนับเป็นคะแนนเก็บ
- [ ] วิธี review หรือ approve activity result ก่อนโอนเป็นคะแนนทางการ
- [ ] learning outcomes หรือ CLO ที่ต้องใช้จริงใน dashboard ของผู้เรียน
- [ ] นิยาม CLO จริงของรายวิชาแรก เช่น `SMAC001 แคลคูลัส 1`
- [ ] badge rules จริงที่ผูกกับแต่ละ CLO
- [ ] เกณฑ์กันการปั่น XP เช่น XP เฉพาะครั้งแรกที่ผ่าน, attempt limits, หรือ admin review
- [ ] จะให้ XP/Badge นับเป็นคะแนนเก็บหรือเป็น progress indicator เท่านั้นในเทอมแรก

หมายเหตุจากการตรวจ repo `lordtd-hub/calculus1-thai`:

- เป็น public GitHub Pages/static site สำหรับ `แคลคูลัส 1 ภาษาไทย`
- โครงสร้างมี HTML หลายหน้า เช่น intro, lessons, continuity, differentiation, integration, diff-app, integrate-app, guess-game, match-game และ missions
- มีระบบ XP/badges/progress/accuracy ใน browser ผ่าน localStorage
- มีแนวคิดภารกิจ OBE/Bloom, rubric, mission heatmap และ active learning
- เหมาะใช้เป็นต้นแบบ experience และเป็น external practice resource ก่อน
- ยังไม่ควรผูก XP/localStorage เป็น official score เพราะ browser/localStorage แก้ไขได้และไม่ผ่าน Firestore Security Rules
- หากต้องใช้ XP/Badge เพื่อวัด CLO อย่างจริงจัง ต้องย้ายหลักฐานไปอยู่ใน Firestore ผ่าน `activityAttempts` และ aggregate เป็น `studentProgress` โดยใช้ Firebase Auth UID ไม่ใช้ localStorage เป็นแหล่งอ้างอิงหลัก

## Grading

- [ ] score categories ที่ใช้จริง
- [ ] max score ต่อ item
- [ ] weighting policy
- [ ] นักศึกษาจะเห็น raw score อย่างเดียวหรือเห็น weighted score ด้วย
- [ ] จะแสดง total score หรือไม่

## Deployment

- [x] Firebase project ID for local development: `academic-learning-portal-dev`
- [x] เพิ่ม checklist ก่อน Firebase Hosting preview deploy ที่ `docs/PREVIEW_QA_CHECKLIST.md`
- [x] เพิ่ม Local QA flow ด้วย Firebase Emulator ที่ `docs/LOCAL_QA.md`
- [ ] custom domain
- [ ] อนุญาต preview deploy หรือไม่
- [ ] อนุมัติ production deploy หรือไม่

หมายเหตุ: Firebase CLI ใช้ผ่าน local project dependency ได้ด้วย `npx firebase`
จึงยังไม่จำเป็นต้องติดตั้ง global CLI ด้วย `npm install -g firebase-tools`
และยังไม่มีการ deploy จนกว่าผู้ใช้จะอนุมัติชัดเจน

## Privacy

- [ ] คะแนนต้องถูกซ่อนไว้จนกว่าจะ publish หรือไม่
- [ ] หากต้องซ่อนคะแนนจนกว่าจะ publish ควรใช้ student-visible published-only documents แยกหรือไม่
- [ ] feedback จะแสดงให้นักศึกษาเห็นหรือไม่
- [ ] attendance จะรวมอยู่ในคะแนนหรือไม่
- [ ] นักศึกษาจะเห็น class statistics หรือไม่

## ก่อนใช้งานจริงควรตัดสินใจเพิ่มเติม

- [ ] ใครเป็นผู้ดูแลข้อมูล public content
- [ ] ใครมีสิทธิ์ import CSV
- [ ] ขั้นตอนตรวจ CSV ก่อนกดเขียนลง Firestore
- [ ] แนวทางสำรองข้อมูลหรือ export ข้อมูล
- [ ] นโยบายเมื่ออาจารย์แก้ไขคะแนนหลัง publish แล้ว
