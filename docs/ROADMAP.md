# Roadmap

เอกสารนี้สรุป milestone ของโครงการ เพื่อให้อาจารย์หรือผู้ดูแลระบบเห็นภาพรวมว่าแต่ละช่วงทำอะไร และอะไรยังไม่ควรทำก่อนถึงเวลา

## Phase 1 — Project foundation

- สร้าง `AGENTS.md` และเอกสารใน `docs/`
- สร้าง React/Vite app
- เพิ่ม layout และ routes หลัก
- เพิ่ม placeholder content

สถานะ: เสร็จแล้ว

## Phase 2 — Public academic website

- Home
- About
- Teaching
- Course pages
- Research
- Projects
- Contact

เนื้อหาต้องเป็น placeholder จนกว่าผู้ใช้จะให้ข้อมูลจริง

สถานะ: เสร็จแล้ว

## Phase 3 — Firebase foundation

- Firebase app config
- Auth state provider
- Login page
- Protected routes
- Firestore client helpers
- Firestore rules

สถานะ: เสร็จแล้ว

## Phase 4 — Student portal

- My courses
- My scores
- Feedback
- Announcements
- Empty states

ข้อสำคัญ: นักศึกษาต้องอ่านได้เฉพาะคะแนนของตนเอง และ route ห้ามรับ student UID จาก URL

สถานะ: เสร็จแล้ว

## Phase 5 — Admin dashboard

- Manage courses
- Manage enrollments
- Manage score items
- Import scores from CSV
- Preview before import
- Publish/unpublish scores

ข้อสำคัญ: admin access ต้องตรวจจาก `admins/{uid}`

สถานะ: เสร็จแล้ว

## Phase 6 — Security and quality

- Firestore rules tests
- Build checks
- Lint checks
- Manual QA checklist
- Thai-first localization review สำหรับข้อความที่ผู้ใช้เห็นและเอกสาร
- Documentation updates

ข้อควรระวัง: Firestore Rules tests ต้องใช้ Java runtime

สถานะ: เริ่มแล้วและมี tests แล้ว แต่ต้องรันให้ผ่านในเครื่องที่พร้อมก่อนใช้ข้อมูลจริง

## Phase 7 — Activity and learning progress foundation

- กำหนด activity/media contract กลาง
- เพิ่ม activity catalog สำหรับรายวิชา
- เพิ่มพื้นที่เล่นสื่อหรือกิจกรรมสำหรับผู้เรียนที่ enroll แล้ว
- เก็บ practice attempts แยกจากคะแนนทางการ
- เพิ่ม student progress dashboard เช่น completion, XP, badges, accuracy และ learning outcome progress
- เพิ่ม admin review flow สำหรับกรณีต้องแปลง activity progress เป็นคะแนนเก็บ

ข้อสำคัญ: คะแนนทางการยังต้องอยู่ใน `studentScores/{uid}` และควรเขียนโดย admin หรือ trusted grading flow เท่านั้น

สถานะ: วาง contract เริ่มต้นแล้วใน `docs/ACTIVITY_MODEL.md` และ `src/features/activities/activityTypes.ts`

## Phase 8 — Preview deployment

- Firebase Hosting preview
- ทดสอบด้วย fake data เท่านั้น
- ตรวจ privacy อีกครั้ง
- เตรียม production checklist

สถานะ: ยังไม่เริ่ม

ห้าม deploy production เว้นแต่ผู้ใช้สั่งชัดเจน

## Localization rule

ภาษาไทยเป็นภาษาหลักสำหรับ user-facing text และเอกสารโครงการ

งาน localization ในอนาคตควรเปลี่ยนเฉพาะ human-readable strings และคง code-critical identifiers เป็น English เช่น route paths, Firestore document paths, component names, variable names, environment variables, package scripts, CSS class names และ Security Rules logic

หากการเปลี่ยนข้อความจำเป็นต้องเปลี่ยน logic ให้หยุดและอธิบายเหตุผลก่อนแก้

## Later ideas

แนวคิดต่อไปนี้อยู่นอกขอบเขต MVP และยังไม่ควร implement หากผู้ใช้ไม่ได้สั่ง:

- official online quizzes
- auto grading สำหรับคะแนนจริง
- assignment submission
- AI tutor
- advanced learning analytics
- video integration
- discussion forum
- multilingual content management
