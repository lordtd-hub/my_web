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
- Local QA with Firebase Auth/Firestore Emulator
- Fake data seed script สำหรับ admin/student/course/roster/enrollment/score items/student scores
- Manual QA checklist
- Thai-first localization review สำหรับข้อความที่ผู้ใช้เห็นและเอกสาร
- Documentation updates

ข้อควรระวัง: Firestore Rules tests ต้องใช้ Java runtime

สถานะ: มี rules tests, local emulator QA mode, seed script และ manual QA checklist แล้ว ต้องใช้ให้ผ่านครบก่อน preview deploy

## Phase 7 — Activity and learning progress foundation

- กำหนด activity/media contract กลาง
- กำหนด assessment contract กลางสำหรับ CLO, Bloom level, evidence, rubric, XP/badge และ official score boundary
- เพิ่ม external interactive learning resources เป็นสื่อฝึกในหน้า Teaching/Courses
- เพิ่ม activity catalog สำหรับรายวิชา
- เพิ่มพื้นที่เล่นสื่อหรือกิจกรรมสำหรับผู้เรียนที่ enroll แล้ว
- เก็บ practice attempts แยกจากคะแนนทางการ
- เพิ่ม student progress dashboard เช่น completion, XP, badges, accuracy และ learning outcome progress
- เพิ่ม admin review flow สำหรับกรณีต้องแปลง activity progress เป็นคะแนนเก็บ

ข้อสำคัญ: คะแนนทางการยังต้องอยู่ใน `studentScores/{uid}` และควรเขียนโดย admin หรือ trusted grading flow เท่านั้น

สถานะ: วาง contract เริ่มต้นแล้วใน `docs/ACTIVITY_MODEL.md`, `docs/ASSESSMENT_MODEL.md`, `src/features/activities/activityTypes.ts` และ `src/features/assessment/assessmentTypes.ts`, เพิ่ม external resource แรก `แคลคูลัส 1 ภาษาไทย`, เพิ่ม activity catalog แบบอ่านอย่างเดียวที่ `/student/courses/:courseId/activities` สำหรับผู้เรียนที่ลงทะเบียนแล้ว, เพิ่มหน้าอาจารย์ `/admin/courses/:courseId/assessment` สำหรับบันทึก/แก้ไข CLO และเพิ่มหน้า `/student/courses/:courseId/self-assessment` ให้ผู้เรียนประเมินตนเองตาม CLO ที่ publish แล้ว โดยยังไม่เชื่อมคะแนนทางการ

## Phase 8 — Preview deployment

- ผ่าน Local QA ตาม `docs/LOCAL_QA.md`
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
