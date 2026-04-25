# Preview QA Checklist

เอกสารนี้ใช้ตรวจระบบก่อนทำ Firebase Hosting preview deploy เท่านั้น ยังไม่ใช่ production deploy และห้ามใช้ข้อมูลจริงของนักศึกษาหรือคะแนนจริงในขั้นนี้

## หลักทั่วไป

- [ ] ใช้ Firebase project dev ที่ถูกต้อง: `academic-learning-portal-dev`
- [ ] `.env.local` ไม่ถูก track ใน git
- [ ] ใช้ข้อมูลปลอมเท่านั้น
- [ ] ไม่มีคะแนนใน public files, Markdown, static JSON, URL หรือ localStorage
- [ ] ยังไม่ deploy production

## คำสั่งตรวจพื้นฐาน

รันจาก root ของโปรเจกต์:

```bash
npm run lint
npm run build
npm test
```

ผลที่ต้องการ:

- [ ] lint ผ่าน
- [ ] build ผ่าน
- [ ] Firestore Security Rules tests ผ่านครบ

## Firestore และสิทธิ์

- [ ] `npx firebase use` ชี้ไปที่ `academic-learning-portal-dev`
- [ ] มีเอกสาร `admins/{uid}` ของอาจารย์ใน Firestore dev
- [ ] anonymous อ่านคะแนนไม่ได้
- [ ] student อ่านคะแนนตัวเองได้
- [ ] student อ่านคะแนนคนอื่นไม่ได้
- [ ] student เขียนคะแนนไม่ได้
- [ ] student สร้าง `admins/{uid}` เองไม่ได้
- [ ] admin อ่าน/เขียนข้อมูลรายวิชา roster enrollment score items และ student scores ที่จำเป็นได้

## Admin Flow

- [ ] admin login ด้วย Google ได้
- [ ] admin เข้า `/admin` ได้
- [ ] สร้างรายวิชาทดสอบได้ โดยใช้ข้อมูลปลอม
- [ ] รายวิชาแสดง `courseCode`, `sections`, `status` และ `portalEnabled`
- [ ] หน้า course detail แสดง summary ของ roster, enrollments, score items และ student scores
- [ ] เพิ่ม roster ด้วยรหัสนักศึกษา 13 หลักได้
- [ ] import roster CSV ได้ โดย preview ก่อนเขียน
- [ ] เพิ่ม enrollment ด้วยข้อมูลปลอมได้
- [ ] สร้าง score item ได้
- [ ] import CSV คะแนนปลอมได้ โดย preview ก่อนเขียน

## Student Flow

- [ ] student login ด้วย Google account นักศึกษาทดสอบได้
- [ ] ถ้า email เป็น `{studentId}@student.sru.ac.th` และอยู่ใน roster ระบบ self-link เป็น enrollment ได้
- [ ] `/student` แสดง dashboard เฉพาะรายวิชาของบัญชีนั้น
- [ ] `/student/courses` แสดงเฉพาะรายวิชาที่ลงทะเบียนกับอาจารย์สิทธิโชค
- [ ] `/student/courses/:courseId/scores` อ่าน score document ด้วย Firebase Auth UID ของผู้ใช้ปัจจุบัน
- [ ] student เห็นเฉพาะคะแนนของตัวเอง
- [ ] student เข้า `/admin` ไม่ได้ หากไม่มี `admins/{uid}`

## ข้อมูลรายวิชาแรกที่ควรทดสอบ

แนะนำเริ่มจากรายวิชาทดสอบที่แทน `SMAC001 แคลคูลัส 1` เพราะมี external interactive resource เป็นแนวคิดแล้ว แต่ยังต้องใช้ข้อมูลปลอมจนกว่าจะพร้อมใช้งานจริง

ข้อควรจำ:

- `SMAC001 แคลคูลัส 1` ที่มี section `P01` และ `P02` ควรเป็น course เดียวใน portal หากเรียนร่วมกันและใช้สื่อ/คะแนนร่วมกัน
- section ควรเก็บใน enrollment หรือ roster metadata
- ยังไม่ควรนำ XP, badge หรือ localStorage จากสื่อ interactive มาเป็นคะแนนทางการ

## ก่อน preview deploy

- [ ] ทดสอบ browser flow ด้วยข้อมูลปลอมครบอย่างน้อย 1 รายวิชา
- [ ] ตรวจว่าไม่มีข้อมูลจริงใน Firestore dev
- [ ] ตรวจว่าไม่มี `.env.local` หรือ secret ถูก stage/commit
- [ ] ตรวจ `git status --short`
- [ ] ขออนุญาตผู้ใช้ชัดเจนก่อนทำ preview deploy

## Blockers ที่ยังต้องยืนยัน

- [ ] บัญชี student test จริงที่ email ตรงกับรหัสนักศึกษาใน roster
- [ ] CSV format จริงที่จะใช้หลังข้อมูล registrar นิ่ง
- [ ] CLO จริงของรายวิชาแรก
- [ ] เกณฑ์ XP/badge ว่าเป็น progress indicator หรือคะแนนเก็บ
