# Personal Academic Learning Portal

โปรเจกต์นี้เป็นเว็บส่วนตัวเชิงวิชาการสำหรับอาจารย์คณิตศาสตร์ พร้อมระบบสำหรับนักศึกษาที่ลงทะเบียนเรียนและแดชบอร์ดอาจารย์สำหรับจัดการรายวิชาและคะแนน

เอกสารนี้เขียนเป็นภาษาไทยเป็นหลัก เพื่อให้อาจารย์หรือผู้ดูแลโครงการอ่านและดูแลต่อได้ง่ายขึ้น คำศัพท์ทางเทคนิค เช่น Firebase, Firestore, Authentication, Hosting, CSV, UID, Vite, React และ TypeScript จะคงเป็น English เมื่อช่วยให้เข้าใจตรงกว่า

## เป้าหมายของโครงการ

1. เว็บสาธารณะสำหรับแนะนำประวัติ ผลงาน และการสอนของอาจารย์
2. หน้ารายวิชาสำหรับเผยแพร่ข้อมูลและสื่อการเรียนรู้ที่อนุญาตให้เปิดเผยได้
3. ระบบนักศึกษาสำหรับให้นักศึกษาที่เข้าสู่ระบบดูรายวิชาและคะแนนของตนเอง
4. แดชบอร์ดอาจารย์สำหรับจัดการรายวิชา การลงทะเบียน และ import คะแนนจาก CSV

## สถานะปัจจุบัน

โปรเจกต์มีโครงหลักของ Vite + React + TypeScript แล้ว รวมถึง:

- หน้า public website
- Firebase client setup และ Authentication provider
- เส้นทางระบบนักศึกษา
- เส้นทางแดชบอร์ดอาจารย์
- CSV import flow สำหรับคะแนน
- Firestore Security Rules
- Firestore Rules tests

ยังไม่ได้ deploy และยังไม่ควรใส่ข้อมูลจริงของอาจารย์ นักศึกษา หรือคะแนนจริง จนกว่าจะทดสอบ Security Rules ผ่านครบถ้วนในเครื่องที่มี Java runtime

## โครงสร้างไฟล์สำคัญ

```text
.
├─ AGENTS.md
├─ PLANS.md
├─ README.md
├─ docs/
│  ├─ PROJECT_BRIEF.md
│  ├─ ARCHITECTURE.md
│  ├─ FIRESTORE_SCHEMA.md
│  ├─ SECURITY_MODEL.md
│  ├─ ROADMAP.md
│  ├─ DECISIONS_NEEDED.md
│  └─ CODEX_RUNBOOK.md
├─ prompts/
│  ├─ 00_read_context_first.md
│  ├─ 01_scaffold_app.md
│  ├─ 02_public_academic_pages.md
│  ├─ 03_firebase_integration.md
│  ├─ 04_student_portal.md
│  ├─ 05_admin_csv_import.md
│  └─ 06_security_rules_tests.md
├─ src/
│  ├─ app/
│  ├─ pages/
│  │  ├─ public/
│  │  ├─ student/
│  │  └─ admin/
│  ├─ features/
│  ├─ lib/
│  └─ styles/
├─ firestore.rules
├─ firebase.json
└─ tests/
   └─ firestore.rules.test.mjs
```

## คำสั่งที่ใช้บ่อย

ติดตั้ง dependencies:

```bash
npm install
```

เปิด dev server:

```bash
npm run dev
```

ตรวจ build:

```bash
npm run build
```

ตรวจ lint:

```bash
npm run lint
```

รัน Firestore Rules tests:

```bash
npm test
```

หมายเหตุ: `npm test` ใช้ Firebase Emulator Suite และต้องมี Java runtime ในเครื่อง หากยังไม่มี Java คำสั่งนี้จะ fail ก่อนเริ่มทดสอบจริง

## การตั้งค่า Firebase

ดูรายละเอียดใน `docs/FIREBASE_SETUP.md`

โดยสรุป:

1. สร้าง Firebase project
2. Register web app
3. copy `.env.example` เป็น `.env.local`
4. ใส่ค่า Firebase web config
5. เปิด Google Sign-In ใน Firebase Console
6. สร้าง `admins/{uid}` สำหรับอาจารย์หรือผู้ดูแลระบบก่อนเข้าใช้แดชบอร์ดจริง

ห้าม commit `.env.local`, service account key หรือข้อมูลลับอื่น ๆ

## หลักการด้านภาษา

เอกสารและข้อความที่ผู้ใช้เห็นควรใช้ภาษาไทยเป็นหลัก:

- public website: ภาษาไทยเชิงวิชาการ สุภาพ กระชับ อ่านง่าย
- ระบบนักศึกษา: ภาษาไทยสุภาพ ชัดเจน เข้าใจง่าย
- แดชบอร์ดอาจารย์: ภาษาไทยที่ใช้งานตรงประเด็นและไม่เยิ่นเย้อ

ไม่ควรแปลสิ่งที่เป็น code-critical identifier เช่น route path, file name, React component name, TypeScript variable, Firebase collection name, Firestore document path, environment variable, package script, CSS class และ Security Rules logic

## CSV import

ตัวอย่างรูปแบบ CSV อยู่ที่:

```text
examples/sample_scores.csv
```

CSV import ทำงานใน browser:

- ไม่ upload CSV ไป Cloud Storage
- ไม่ใช้ Cloud Functions
- ไม่เก็บคะแนนใน static files หรือ localStorage
- เขียนคะแนนเฉพาะแถวที่ match กับ enrollment ใน Firestore แล้ว
- เขียนคะแนนไปที่ `courses/{courseId}/studentScores/{uid}`

ตัวอย่าง CSV เป็นข้อมูลปลอมเพื่ออธิบายรูปแบบเท่านั้น ห้ามใช้เป็นข้อมูลนักศึกษาจริง

## หลักความปลอดภัยที่ห้ามละเมิด

- ห้ามเดาข้อมูลจริงของอาจารย์ มหาวิทยาลัย รายวิชา นักศึกษา หรือคะแนน
- ห้ามเก็บคะแนนใน public files, Markdown, static JSON, URL หรือ localStorage
- คะแนนต้องอยู่ใน Firestore และถูกคุ้มครองด้วย Firestore Security Rules
- นักศึกษาต้องอ่านได้เฉพาะ score document ของตนเอง
- admin access ต้องมาจาก `admins/{uid}` ไม่ใช่ role field ที่ผู้ใช้แก้เองได้
- ห้าม deploy production เว้นแต่ผู้ใช้สั่งชัดเจน

## เอกสารที่ควรอ่านต่อ

- `docs/PROJECT_BRIEF.md`: เป้าหมายและขอบเขตโครงการ
- `docs/ARCHITECTURE.md`: โครงสร้างระบบและ data flow
- `docs/FIRESTORE_SCHEMA.md`: โครงสร้างข้อมูลใน Firestore
- `docs/SECURITY_MODEL.md`: โมเดลความปลอดภัย
- `docs/ROADMAP.md`: แผนงานตาม milestone
- `docs/DECISIONS_NEEDED.md`: เรื่องที่ยังต้องให้ผู้ใช้ตัดสินใจ
- `docs/CODEX_RUNBOOK.md`: วิธีให้ Codex ทำงานกับโครงการนี้
