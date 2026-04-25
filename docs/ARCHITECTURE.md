# Architecture

## Stack ที่แนะนำสำหรับ MVP

```text
Vite + React + TypeScript
React Router
Tailwind CSS
Firebase Hosting
Firebase Authentication
Cloud Firestore
```

## เหตุผลที่เลือก stack นี้

MVP ควรเป็น client-side web application ที่ deploy ด้วย Firebase Hosting

แอปจะติดต่อ Firebase Authentication และ Cloud Firestore โดยตรง การควบคุมสิทธิ์การเข้าถึงข้อมูลต้องบังคับด้วย Firestore Security Rules

แนวทางนี้ช่วยให้เวอร์ชันแรกไม่ต้องมี custom backend

## ขอบเขตการใช้ภาษา

ภาษาไทยเป็นภาษาหลักสำหรับข้อความที่ผู้ใช้เห็นและเอกสารโครงการ งาน localization ในอนาคตควรเปลี่ยนเฉพาะข้อความที่เป็น human-readable display text เว้นแต่มีเหตุผลจำเป็นด้าน logic

ห้ามแปล code-critical identifiers:

```text
file names
route paths such as /student, /admin, /courses
React component names
TypeScript variable names
function names
Firebase collection names
Firestore document paths
environment variable names
import/export names
package.json scripts
CSS class names
security rules logic
```

คงคำศัพท์เทคนิคเป็น English เมื่อชัดเจนกว่า เช่น Firebase, Firestore, Authentication, Hosting, Security Rules, CSV และ UID ส่วน label ที่ผู้ใช้เห็นสามารถใช้ภาษาไทยได้ เช่น `เข้าสู่ระบบ`, `รายวิชาของฉัน`, `พื้นที่ผู้เรียนในรายวิชา` และ `แดชบอร์ดอาจารย์`

## โมดูลหลักของระบบ

```text
Public Website
- Home
- About
- Teaching
- Courses
- Research
- Projects
- Contact

Course Learner Area
- Login
- My Courses
- My Scores
- Course Announcements

Teacher/Admin
- Manage Courses
- Manage Enrollments
- Manage Score Items
- Import Scores from CSV
```

## Activity and media contract

รายวิชา สื่อ interactive เกม และภารกิจในอนาคตควรต่อเข้าระบบผ่าน contract กลาง ไม่ hardcode เฉพาะหน้าใดหน้าหนึ่ง เพื่อให้เพิ่มสื่อใหม่ได้โดยไม่ต้องแก้โครงสร้างหลักทุกครั้ง

เอกสารหลักอยู่ที่:

```text
docs/ACTIVITY_MODEL.md
```

TypeScript contract เบื้องต้นอยู่ที่:

```text
src/features/activities/activityTypes.ts
```

แนวคิดหลักคือแยกข้อมูลเป็น 3 ชั้น:

```text
activityAttempts   = หลักฐานการทำกิจกรรม
studentProgress    = พัฒนาการและ dashboard ส่วนตัว
studentScores      = คะแนนทางการที่ publish แล้ว
```

คะแนนทางการยังต้องอยู่ใน `courses/{courseId}/studentScores/{uid}` และห้ามให้ browser เขียนคะแนนจริงเองจากผลที่คำนวณใน client โดยตรง เว้นแต่มี trusted grading flow ที่ออกแบบและทดสอบแล้ว

## เนื้อหา public แบบ placeholder

Milestone 2 เก็บเนื้อหา public academic ไว้ที่:

```text
src/content/publicAcademic.ts
```

ไฟล์นี้ควรมีเฉพาะ placeholder สำหรับ profile, course, research, project และ contact content เท่านั้น ห้ามใส่ข้อมูลจริงของอาจารย์จนกว่าผู้ใช้จะให้ข้อมูล และห้ามใส่ข้อมูลนักศึกษาหรือคะแนนในไฟล์นี้เด็ดขาด

เมื่อแปล placeholder เป็นภาษาไทย ให้ใช้ภาษาไทยเชิงวิชาการที่สุภาพและอ่านง่าย ห้ามเพิ่มข้อมูลจริงของอาจารย์ มหาวิทยาลัย รายวิชา หรือนักศึกษาเอง

## Firebase client integration

Milestone 3 เพิ่ม client-side Firebase setup ใน:

```text
src/lib/firebase/
src/features/auth/
src/lib/firestore/
src/routes/ProtectedRoute.tsx
```

Firebase config อ่านจาก Vite environment variables หากยังไม่ได้ตั้งค่า `.env.local` ส่วน UI ที่ต้องใช้ Firebase จะแสดงคำแนะนำการตั้งค่าแทนการเชื่อมต่อจริง

Google Sign-In เป็น provider หลักใน Milestone 3 โดยยังขึ้นกับการตั้งค่าใน Firebase Console

## Route structure ที่ใช้ในระบบ

ห้ามเปลี่ยน route path เหล่านี้เพียงเพราะ localization เพราะ path เป็นส่วนหนึ่งของโครงสร้างแอป:

```text
/
/about
/teaching
/courses
/courses/:slug
/research
/projects
/contact
/login
/student
/student/courses
/student/courses/:courseId/scores
/admin
/admin/courses
/admin/courses/new
/admin/courses/:courseId
/admin/courses/:courseId/students
/admin/courses/:courseId/scores
/admin/courses/:courseId/import
```

## Data flow

### หน้า public course

```text
Visitor opens /courses/:slug
App reads public course metadata
If course is public, show overview and public materials
```

คำอธิบาย:

ผู้เข้าชมเปิดหน้ารายวิชาผ่าน `/courses/:slug` แอปอ่านข้อมูลรายวิชาที่เปิดเผยได้ และแสดงเฉพาะข้อมูล public เท่านั้น

หากรายวิชาเดียวกันเปิดหลาย section แต่เรียนร่วมกัน เช่น แคลคูลัสในภาคเรียน 1/2569 ที่มี 2 section ให้ถือเป็น course เดียวในระบบรายวิชา และเก็บ section เป็น metadata ของ enrollment หรือกลุ่มผู้เรียน ไม่ควรสร้าง course แยกถ้าเนื้อหา สื่อ กิจกรรม และคะแนนใช้ร่วมกัน

ตัวอย่างปัจจุบันจาก screenshot registrar ปีการศึกษา 2569 ภาคเรียนที่ 1:

```text
SMAC001 แคลคูลัส 1
- section P01: จำนวนรับ 14 ลงแล้ว 11
- section P02: จำนวนรับ 20 ลงแล้ว 16
```

ใน portal ควรวางเป็น course เดียว เช่น `SMAC001 แคลคูลัส 1` แล้วให้ enrollment แต่ละคนมี section metadata เป็น `P01` หรือ `P02` หากต้องใช้แยกกลุ่มในภายหลัง

### หน้าคะแนนของผู้เรียนในรายวิชา

```text
Student logs in
App gets auth.uid
App queries enrollment documents constrained to the enrollment `uid` field
App reads courses/{courseId}/studentScores/{auth.uid}
App displays only that student's data
```

Milestone 4 ใช้ student routes ต่อไปนี้:

```text
/student
/student/courses
/student/courses/:courseId/scores
```

`courseId` ใน route ใช้เลือกเฉพาะรายวิชาเท่านั้น แอปไม่รับ student UID จาก URL และการอ่านคะแนนต้องใช้ Firebase Auth UID ของผู้ที่เข้าสู่ระบบเสมอ

### การ import คะแนนของ admin

```text
Admin logs in
App verifies admins/{uid}
Admin selects CSV file
Browser parses CSV
App validates required columns
App previews data
Admin confirms import
App writes score documents to Firestore
```

Milestone 5 ใช้ admin routes ต่อไปนี้:

```text
/admin
/admin/courses
/admin/courses/new
/admin/courses/:courseId
/admin/courses/:courseId/students
/admin/courses/:courseId/scores
/admin/courses/:courseId/import
```

CSV files จะถูก parse ใน browser เท่านั้น ไม่ upload ไป Cloud Storage ไม่เก็บใน public files และไม่ส่งผ่าน Cloud Functions

import writer จะโหลด `courses/{courseId}/enrollments/{uid}` ก่อน และเขียนเฉพาะแถวที่ match แล้วไปที่ `courses/{courseId}/studentScores/{uid}`

## สิ่งที่ต้องหลีกเลี่ยงใน MVP

- ไม่ใช้ Cloud Functions
- ไม่ใช้ Cloud Storage
- ไม่เก็บคะแนนใน static JSON
- ไม่เก็บคะแนนใน Markdown
- ไม่เก็บคะแนนใน localStorage
- ไม่เปิดเผยคะแนนผ่าน URL
- ไม่เปลี่ยน route path เพื่อการแปลภาษา
