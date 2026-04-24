# Security Model

โครงการนี้มีข้อมูลคะแนนนักศึกษา ความเป็นส่วนตัวและการควบคุมสิทธิ์จึงเป็นข้อกำหนดหลัก ไม่ใช่รายละเอียดเสริม

## หลักความปลอดภัยหลัก

นักศึกษา 1 คนต้องอ่านได้เฉพาะ score documents ของตนเองเท่านั้น

## Trust model

### ผู้เข้าชมทั่วไป

อ่านได้:

- public pages
- public course summaries
- public learning materials

อ่านไม่ได้:

- enrollments
- student score documents
- admin dashboard

### นักศึกษาที่เข้าสู่ระบบแล้ว

อ่านได้:

- user profile ของตนเอง
- enrollment ของตนเอง
- course materials ที่ publish แล้วสำหรับรายวิชาที่ตนลงทะเบียน
- score documents ของตนเอง

อ่านไม่ได้:

- คะแนนของนักศึกษาคนอื่น
- admin documents
- ภาพรวมคะแนนทั้งห้อง

เขียนไม่ได้:

- scores
- enrollments
- admin documents
- course settings

### อาจารย์หรือ admin

อ่านและเขียนได้:

- courses
- enrollments
- announcements
- score items
- student scores

admin status ตรวจจาก:

```text
admins/{request.auth.uid}
```

## เหตุผลที่ไม่ใช้ role field ใน users/{uid}

ห้ามใช้ field นี้เป็นแหล่งอ้างอิงสิทธิ์ admin:

```ts
users/{uid}.role = "admin"
```

เหตุผล:
หากผู้ใช้สามารถ update profile ของตนเองได้ แล้ว rules ผิดพลาดเพียงเล็กน้อย ผู้ใช้อาจยกระดับสิทธิ์ตนเองเป็น admin ได้

ให้ใช้ admin allowlist แทน:

```text
admins/{uid}
```

## Security checks ที่ต้องมี

Codex ต้อง implement หรือ document tests สำหรับกรณีเหล่านี้:

- Anonymous user อ่าน scores ไม่ได้
- Student A อ่านคะแนนของ Student A ได้
- Student A อ่านคะแนนของ Student B ไม่ได้
- Student เขียน scores ไม่ได้
- Student สร้าง admin document ไม่ได้
- Admin จัดการ course data ได้
- Admin import scores ได้

Milestone 6 เพิ่ม executable Firestore Rules tests ที่:

```text
tests/firestore.rules.test.mjs
```

test suite ใช้ fake UIDs, fake courses, fake enrollments และ fake score documents เท่านั้น ครอบคลุม:

- Anonymous users อ่าน student score documents ไม่ได้
- Public visitors อ่าน public course metadata ได้
- Students query ได้เฉพาะ enrollment records ที่ `uid` field ตรงกับ Auth UID ของตน
- Student A อ่าน score document ของ Student A ได้
- Student A อ่าน score document ของ Student B ไม่ได้
- Students เขียน score documents ไม่ได้
- Students สร้าง admin documents ไม่ได้
- Admins อ่านและเขียน courses ได้
- Admins เขียน enrollments ได้
- Admins เขียน student score documents ได้

รันด้วย:

```bash
npm test
```

Firestore Emulator ต้องใช้ Java runtime ในเครื่อง หากยังไม่ได้ติดตั้ง Java คำสั่ง test จะ fail ก่อนเริ่ม assertions

## Firestore Rules Template

ดู template ได้ที่:

```text
templates/firestore.rules.template
```

Milestone 3 เพิ่มไฟล์ rules จริงที่:

```text
firestore.rules
```

rules ใช้ `admins/{request.auth.uid}` สำหรับ teacher/admin access และจำกัด student score reads ให้อยู่ที่ `courses/{courseId}/studentScores/{uid}` โดย `uid` ต้องตรงกับ `request.auth.uid` ยกเว้นผู้ขออ่านเป็น admin

Milestone 4 ทำ student UI ตาม constraint เดียวกัน คือ URL มี `courseId` ได้ แต่ score document path ต้องสร้างด้วย `request.auth.uid` จาก Firebase Auth เสมอ นักศึกษาจะไม่เห็น UID ของนักศึกษาคนอื่นและไม่สามารถเลือก score document ID จาก UI ได้

Student course discovery ใช้ collection group query บน enrollment documents โดย `uid` field ต้องตรงกับ Auth UID ของผู้ใช้ที่เข้าสู่ระบบ นักศึกษาเขียน enrollment documents ไม่ได้ ดังนั้น field นี้จึงยังอยู่ภายใต้การควบคุมของ admin

Milestone 4 query เฉพาะ published `scoreItems` เพื่อใช้เป็น label ของคะแนน หากต้องการซ่อนคะแนนที่ยังไม่ publish อย่างแท้จริง data model ต้องไม่เก็บ unpublished values ไว้ใน documents ที่นักศึกษาอ่านได้ หรือควรใช้ published-only document shape แยกต่างหาก เพราะ Firestore Security Rules ซ่อน nested fields บาง field ใน document ที่อนุญาตให้อ่านแล้วไม่ได้

Milestone 5 ให้ admin pages อยู่หลัง `admins/{uid}` allowlist เหมือนเดิม CSV imports ทำงานใน browser, validate required columns, preview matched rows และเขียน score documents เฉพาะนักศึกษาที่ลงทะเบียนในรายวิชานั้นแล้ว

ภายใต้ rules ปัจจุบัน นักศึกษาเขียน enrollments, score items หรือ score documents ไม่ได้

## ข้อควรจำเกี่ยวกับ Firestore Security Rules

Firestore Security Rules ป้องกันที่ระดับ document ไม่ใช่ระดับ UI component

ห้ามพึ่งการซ่อนปุ่มหรือซ่อนเมนูใน UI เพื่อรักษาความปลอดภัย ข้อมูลสำคัญทุกอย่างต้องถูก block ด้วย Firestore Security Rules
