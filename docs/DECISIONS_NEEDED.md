# Decisions Needed

เอกสารนี้เก็บเรื่องที่ยังต้องให้ผู้ใช้ตัดสินใจ Codex ห้ามเดาเอง โดยเฉพาะเรื่องที่เกี่ยวกับข้อมูลจริง ความเป็นส่วนตัว การยืนยันตัวตน การให้สิทธิ์ คะแนน และการ deploy

## ตัวตนและเนื้อหา public

- [ ] ชื่อเว็บไซต์สุดท้าย
- [ ] ชื่ออาจารย์ที่ต้องการแสดงบนเว็บไซต์
- [ ] ตำแหน่งหรือ title
- [ ] ภาควิชา
- [ ] มหาวิทยาลัย
- [ ] email สำหรับเผยแพร่สาธารณะ
- [ ] รูป profile ที่อนุญาตให้ใช้
- [ ] Google Scholar URL
- [ ] GitHub URL
- [ ] ORCID หรือ research profile URL

หมายเหตุ: จนกว่าจะได้ข้อมูลจริง ให้ใช้ placeholder เท่านั้น

## ภาษา

- [x] ใช้ Thai-first เป็นค่าเริ่มต้นสำหรับ UI ที่ผู้ใช้เห็นและเอกสารโครงการ
- [ ] จะมี English version เพิ่มภายหลังหรือไม่
- [ ] จะรองรับ Thai + English language switching ภายหลังหรือไม่

การตัดสินใจปัจจุบัน:
ใช้ภาษาไทยเป็นหลัก public website ควรใช้ภาษาไทยเชิงวิชาการที่สุภาพและอ่านง่าย ระบบนักศึกษาควรสุภาพและเข้าใจง่าย แดชบอร์ดอาจารย์ควรชัดเจนและใช้งานตรงประเด็น

คงคำศัพท์เทคนิคเป็น English เมื่อชัดกว่า เช่น Firebase, Firestore, Authentication, Hosting, Security Rules, CSV และ UID

ห้ามแปล code-critical identifiers เช่น route paths, Firestore document paths, component names, variable names, environment variables, package scripts, CSS class names และ Security Rules logic

## รายวิชา

- [ ] รายวิชาแรกที่จะใช้จริง
- [ ] course code
- [ ] course title
- [ ] รูปแบบ term หรือ semester
- [ ] สื่อการเรียนรู้ใดเปิด public ได้ และสื่อใดต้อง private

## Authentication

- [ ] ใช้ Google sign-in อย่างเดียวหรือไม่
- [ ] ต้องรองรับ email/password หรือไม่
- [ ] ต้องจำกัด university email domain หรือไม่
- [ ] วิธีสร้าง student accounts
- [ ] initial admin UID
- [ ] วิธีสร้างเอกสาร `admins/{uid}` ครั้งแรก

## Student identity

- [ ] ใช้ email เป็น primary identifier หรือไม่
- [ ] ใช้ studentId เป็น display identifier หรือไม่
- [ ] ใช้ทั้ง email และ studentId หรือไม่
- [ ] วิธี map studentId/email กับ Firebase Auth UID

คำแนะนำปัจจุบัน:
ใช้ Firebase Auth UID เป็น database document ID และเก็บ studentId เป็น metadata เท่านั้น

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

## Grading

- [ ] score categories ที่ใช้จริง
- [ ] max score ต่อ item
- [ ] weighting policy
- [ ] นักศึกษาจะเห็น raw score อย่างเดียวหรือเห็น weighted score ด้วย
- [ ] จะแสดง total score หรือไม่

## Deployment

- [x] Firebase project ID for local development: `academic-learning-portal-dev`
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
