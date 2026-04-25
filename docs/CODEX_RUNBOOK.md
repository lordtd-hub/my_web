# Codex Runbook

เอกสารนี้บอกวิธีที่ Codex ควรทำงานกับโครงการนี้ เพื่อให้การพัฒนาเป็นระบบ ปลอดภัย และไม่เผลอใส่ข้อมูลจริงหรือเปลี่ยน security model โดยไม่ตั้งใจ

## ก่อนเริ่มทุกงาน

Codex ควรอ่าน:

```text
AGENTS.md
PLANS.md
docs/PROJECT_BRIEF.md
docs/ARCHITECTURE.md
docs/FIRESTORE_SCHEMA.md
docs/SECURITY_MODEL.md
docs/DECISIONS_NEEDED.md
```

## รูปแบบ prompt ที่ควรใช้

ทุกงานควรระบุแนวทางประมาณนี้:

```text
Read AGENTS.md and docs first.
Implement only the requested milestone.
Do not invent real personal or student data.
Use placeholders.
If privacy/security decisions are missing, ask before implementing.
Run build/lint/tests if available.
Update docs if schema/security/routes changed.
Use Thai as the default language for human-readable UI and documentation text.
```

## Workflow สำหรับ Thai-first localization

เมื่อผู้ใช้ขอให้ localize หรือเขียนข้อความที่ผู้ใช้เห็น:

1. ใช้ภาษาไทยเป็นหลัก
2. เนื้อหา public academic ต้องสุภาพ กระชับ เป็นทางการ และเหมาะกับเว็บไซต์อาจารย์คณิตศาสตร์
3. ข้อความในพื้นที่ผู้เรียนของรายวิชาต้องสุภาพ เข้าใจง่าย และไม่สื่อว่าเป็นระบบกลางของมหาวิทยาลัย
4. ข้อความในแดชบอร์ดอาจารย์ต้องชัดเจน ใช้งานจริงได้ และไม่เยิ่นเย้อ
5. คงคำศัพท์เทคนิคเป็น English เมื่อชัดกว่า เช่น Firebase, Firestore, Authentication, Hosting, Security Rules, CSV และ UID
6. เปลี่ยนเฉพาะ human-readable strings เว้นแต่จำเป็นต้องเปลี่ยน code logic
7. หากข้อความที่จะเปลี่ยนต้องแตะ logic ให้หยุดและอธิบายก่อนแก้
8. ห้ามแปล code-critical identifiers, route paths, Firestore paths, environment variables, package scripts, CSS class names หรือ Security Rules logic
9. ห้ามแต่งข้อมูลจริงของอาจารย์ มหาวิทยาลัย รายวิชา นักศึกษา หรือคะแนน

## คำสั่งที่คาดว่าจะใช้

หลัง scaffold app แล้ว โดยทั่วไปควรรัน:

```bash
npm run build
npm run lint
```

หากมี tests:

```bash
npm test
```

Security rules tests ใช้ Firebase Emulator Suite:

```bash
npm test
```

คำสั่งนี้รัน:

```bash
firebase emulators:exec --project demo-personal-academic-learning-portal-rules-test --only firestore "node --test tests/firestore.rules.test.mjs"
```

ข้อกำหนด:

- ต้องติดตั้ง Java runtime และอยู่ใน `PATH`
- ห้ามใช้ production Firebase project
- test data ต้องเป็น fake-only
- test project ID ต้องขึ้นต้นด้วย `demo-`

หากต้องเปิด Firebase emulators เอง:

```bash
firebase emulators:start
```

## สมมติฐานของ CSV import

Milestone 5 ทำ browser-side CSV importer โดยอิงรูปแบบจาก:

```text
examples/sample_scores.csv
```

สมมติฐานปัจจุบัน:

- required columns คือ `studentId` และ `email`
- `displayName` เป็น optional และใช้เพื่อช่วย preview เท่านั้น
- column ที่ไม่ใช่ required และไม่ใช่ feedback จะถูกมองเป็น score column
- score item IDs สร้างจาก score column headers
- score categories infer จาก header text เช่น quiz, homework, midterm, final หรือ attendance หากไม่เข้าเงื่อนไขจะเป็น `other`
- max score infer จากค่าตัวเลขสูงสุดใน score column
- feedback columns เป็น optional และ detect จาก suffix เช่น `feedback`, `_feedback` หรือ ` feedback`
- imported score items และ score values ถูกตั้งเป็น published ใน MVP
- rows ที่ไม่ match enrollment ที่มีอยู่ด้วย `studentId` หรือ `email` จะถูก skip และไม่เขียนลง Firestore

grading และ privacy decisions ที่ยังไม่ชัดเจนอยู่ใน `docs/DECISIONS_NEEDED.md`

## วิธี review งานของ Codex

หลังจบแต่ละ milestone ผู้ใช้สามารถถาม:

```text
อธิบายสิ่งที่เปลี่ยนแบบ file by file สำหรับคนที่เพิ่งเริ่มดูโปรเจกต์นี้
```

แล้วถามต่อ:

```text
ยังมีความเสี่ยงด้าน security อะไรเหลืออยู่ใน milestone นี้
```

และ:

```text
ก่อนทำต่อ ฉันควรตรวจอะไรด้วยตนเองบ้าง
```

## วิธีจัดการ error

หากคำสั่ง fail, Codex ควร:

1. สรุป error ที่สำคัญ
2. อธิบายสาเหตุที่เป็นไปได้
3. แก้เฉพาะปัญหาที่เกี่ยวข้องและเล็กที่สุด
4. รันคำสั่งซ้ำ
5. หลีกเลี่ยง refactor ที่ไม่เกี่ยวข้อง

## สิ่งที่ Codex ห้ามทำเองโดยอัตโนมัติ

- deploy production
- เพิ่มข้อมูลนักศึกษาจริง
- เพิ่มคะแนนจริง
- เพิ่ม Firebase service account keys
- เพิ่ม Cloud Functions
- เพิ่ม Cloud Storage
- เปลี่ยน security model โดยไม่ update docs
- ตัดสิน grading policy แทนผู้ใช้
- เปลี่ยน route paths หรือ Firestore schema เพียงเพราะต้องการแปลภาษา

## คำถามเรียนรู้ที่แนะนำ

หลังแต่ละ milestone ผู้ใช้อาจถาม:

```text
สอนโค้ดส่วนนี้ให้ฉันเหมือนฉันเขียนโปรแกรมได้ แต่ยังใหม่กับ Firebase
```

```text
อธิบาย security rules พร้อมตัวอย่าง
```

```text
แสดง data flow ตั้งแต่ login จนถึงการแสดงคะแนน
```
