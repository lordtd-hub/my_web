# Step by Step สำหรับใช้งานกับ Codex

เอกสารนี้ออกแบบให้ทำตามทีละขั้น เพื่อให้อาจารย์ได้ศึกษาและควบคุม Codex ได้ง่าย

---

## Step 0 — เตรียมโฟลเดอร์โปรเจกต์

สร้างโฟลเดอร์ใหม่ เช่น

```bash
mkdir academic-learning-portal
cd academic-learning-portal
```

แตกไฟล์ ZIP starter kit ลงในโฟลเดอร์นี้

หลังจากนั้นควรเห็นไฟล์ประมาณนี้:

```text
AGENTS.md
PLANS.md
STEP_BY_STEP_TH.md
docs/
prompts/
examples/
templates/
```

ยังไม่ต้องสร้าง React app เอง ให้ Codex สร้างใน Step 1

---

## Step 1 — ให้ Codex อ่านบริบทก่อน

เปิด Codex ในโฟลเดอร์โปรเจกต์ แล้วส่ง prompt จากไฟล์นี้:

```text
prompts/00_read_context_first.md
```

เป้าหมาย:

- ให้ Codex เข้าใจโปรเจกต์
- ให้ Codex สรุป architecture
- ให้ Codex ตรวจว่ามีข้อมูลอะไรที่ต้องถามอาจารย์
- ยังไม่ให้เขียน code

ผลลัพธ์ที่ควรได้:

- Codex สรุปว่าโปรเจกต์คืออะไร
- Codex อ่าน `DECISIONS_NEEDED.md`
- Codex บอกว่า Milestone ถัดไปคือ scaffold app

---

## Step 2 — สร้างโครงเว็บ React/Vite

ส่ง prompt:

```text
prompts/01_scaffold_app.md
```

เป้าหมาย:

- สร้าง Vite + React + TypeScript
- เพิ่ม React Router
- เพิ่ม Tailwind CSS
- สร้าง route placeholder
- ยังไม่ต่อ Firebase

หลัง Codex ทำเสร็จ ให้ดูว่า build ผ่านหรือไม่:

```bash
npm run build
```

ถ้า Codex ไม่ได้รันให้ ให้เรารันเองแล้วส่ง error กลับไปให้ Codex

---

## Step 3 — ทำหน้าเว็บ public

ส่ง prompt:

```text
prompts/02_public_academic_pages.md
```

เป้าหมาย:

- หน้า Home
- About
- Teaching
- Courses
- Research
- Projects
- Contact
- ใช้ placeholder content เท่านั้น

สิ่งที่ต้องตรวจ:

- ไม่มีข้อมูลจริงที่ Codex แต่งเอง
- หน้าเว็บ responsive
- navigation ใช้งานได้
- เนื้อหาอ่านแล้วเป็นเว็บอาจารย์คณิตศาสตร์

---

## Step 4 — ต่อ Firebase Auth + Firestore

ก่อนทำขั้นนี้ อาจารย์ควรเตรียม Firebase project ไว้ก่อน หรือให้ Codex ทำเป็น `.env.example` และ placeholder config ไปก่อน

ส่ง prompt:

```text
prompts/03_firebase_integration.md
```

เป้าหมาย:

- เพิ่ม Firebase client initialization
- เพิ่ม Authentication
- เพิ่ม Firestore helper
- เพิ่ม `firestore.rules`
- เพิ่ม protected route
- ยังไม่ใช้ Cloud Functions
- ยังไม่ใช้ Cloud Storage

สิ่งที่ต้องตรวจ:

- ไม่มี secret จริงใน repo
- `.env.example` มีแต่ชื่อ variable
- login page มีสถานะ loading/error
- rules สอดคล้องกับ `docs/SECURITY_MODEL.md`

---

## Step 5 — ทำ Student Portal

ส่ง prompt:

```text
prompts/04_student_portal.md
```

เป้าหมาย:

- หน้า `/student`
- หน้า `/student/courses`
- หน้า `/student/courses/:courseId/scores`
- นักศึกษาดูได้เฉพาะคะแนนตนเอง

สิ่งที่ต้องตรวจอย่างจริงจัง:

- score page ใช้ `auth.uid`
- ไม่ใช้ `studentId` จาก URL เพื่ออ่านคะแนน
- ไม่ expose UID ของคนอื่นในหน้าเว็บ
- ไม่มีคะแนนใน localStorage หรือ static files

---

## Step 6 — ทำ Admin Dashboard และ CSV Import

ส่ง prompt:

```text
prompts/05_admin_csv_import.md
```

เป้าหมาย:

- หน้า admin
- สร้าง/แก้ไข course
- เพิ่ม enrollment
- import คะแนนจาก CSV
- preview ก่อนบันทึก
- เขียนคะแนนเข้า Firestore

ตัวอย่าง CSV อยู่ที่:

```text
examples/sample_scores.csv
```

สิ่งที่ต้องตรวจ:

- admin ใช้ `admins/{uid}` เป็นตัวตัดสินสิทธิ์
- CSV ไม่ถูก upload ไป public
- ต้อง match นักศึกษาจาก enrollment ก่อนเขียนคะแนน
- มี validation ก่อน import

---

## Step 7 — เขียน Security Rules Tests

ส่ง prompt:

```text
prompts/06_security_rules_tests.md
```

เป้าหมาย:

- ทดสอบว่า anonymous อ่านคะแนนไม่ได้
- student อ่านคะแนนตัวเองได้
- student อ่านคะแนนคนอื่นไม่ได้
- student เขียนคะแนนไม่ได้
- student สร้าง admin ไม่ได้
- admin จัดการข้อมูลได้

ขั้นนี้สำคัญมาก เพราะระบบมีข้อมูลคะแนนนักศึกษา

---

## Step 8 — Preview Deploy

ส่ง prompt:

```text
prompts/07_preview_deploy_review.md
```

เป้าหมาย:

- deploy preview เท่านั้น
- ยังไม่ deploy production
- ตรวจว่าไม่มีข้อมูลจริงหรือ secret ใน repo

ข้อควรระวัง:

- preview URL อาจเป็น public ถ้ามีคนได้ลิงก์
- ห้ามใช้ข้อมูลคะแนนจริงในช่วงทดสอบ

---

## Step 9 — Review และ Refactor

ส่ง prompt:

```text
prompts/99_review_and_refactor.md
```

เป้าหมาย:

- ให้ Codex ตรวจโครงสร้างโปรเจกต์
- ตรวจ security
- ตรวจเอกสาร
- ปรับ code ให้อ่านง่าย
- ไม่เพิ่ม feature ใหม่โดยไม่จำเป็น

---

## คำแนะนำเวลาเรียนรู้

อย่าทำทุก step รวดเดียว

แนะนำลำดับการศึกษา:

```text
วันแรก: Step 0–2
วันที่สอง: Step 3
วันที่สาม: Step 4
วันที่สี่: Step 5
วันที่ห้า: Step 6–7
```

เวลา Codex ทำงานเสร็จ ให้ถามต่อว่า:

```text
Explain what you changed file by file in beginner-friendly terms.
```

หรือ

```text
Teach me how this part works before we continue to the next milestone.
```
