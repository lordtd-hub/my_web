# Local QA with Firebase Emulator

เอกสารนี้เป็นขั้นตอนทดสอบด่าน 1 ก่อน preview deploy โดยไม่ใช้บัญชี Google จริงและไม่แตะ Firebase project จริง

## เป้าหมาย

- ทดสอบ admin/student flow ด้วยข้อมูลปลอม
- ใช้ Firebase Auth Emulator และ Firestore Emulator
- ไม่ต้องสมัคร Google account สำหรับนักศึกษาทดสอบ
- ไม่ใส่ข้อมูลจริงของนักศึกษาหรือคะแนนจริง
- ใช้ Google sign-in จริงเฉพาะ smoke test ตอน preview deploy เท่านั้น

## สิ่งที่ต้องรัน

เปิด 3 terminal จาก root ของโปรเจกต์

Terminal 1:

```bash
npm run qa:emulators
```

Terminal 2:

```bash
npm run qa:seed
```

Terminal 3:

```bash
npm run dev:emulator
```

จากนั้นเปิด:

```text
http://localhost:5173/login
```

หาก port 5173 ถูกใช้งานอยู่ Vite จะเลือก port ถัดไป ให้ใช้ URL ที่ terminal แสดง

## บัญชีทดสอบ

บัญชีเหล่านี้เป็นข้อมูลปลอมใน Firebase Auth Emulator เท่านั้น

| บทบาท | Email | Password |
| --- | --- | --- |
| Admin | `teacher-admin@example.test` | `local-test-password` |
| Student | `6612345678901@student.sru.ac.th` | `local-test-password` |
| Non-roster student | `6612345678999@student.sru.ac.th` | `local-test-password` |

หน้า `/login` จะแสดงปุ่มบัญชีทดสอบเฉพาะเมื่อรันด้วย `npm run dev:emulator`

## ข้อมูลปลอมที่ seed

`npm run qa:seed` จะสร้างหรืออัปเดตข้อมูลใน emulator:

- fake admin ใน `admins/{uid}`
- fake student account ใน Auth Emulator
- fake course: `local-smac001`
- fake roster สำหรับ `6612345678901@student.sru.ac.th`
- fake enrollment ของ student
- fake score items: `Quiz 1`, `Midterm`
- fake student scores

ไม่มีข้อมูลชุดนี้ถูกเขียนไปยัง Firebase project จริง

## Flow ที่ต้องทดสอบ

### Admin

- [ ] login ด้วยปุ่ม `อาจารย์ทดสอบ`
- [ ] เข้า `/admin` ได้
- [ ] เห็นรายวิชา `SMAC001 แคลคูลัส 1`
- [ ] เข้า course detail แล้วเห็น control summary
- [ ] เข้า roster/enrollment page ได้
- [ ] หน้า import scores เปิดได้

### Student

- [ ] logout จาก admin
- [ ] login ด้วยปุ่ม `นักศึกษาทดสอบ`
- [ ] เข้า `/student` แล้วเห็น dashboard
- [ ] เข้า `/student/courses` แล้วเห็นเฉพาะ `SMAC001 แคลคูลัส 1`
- [ ] เปิด `/student/courses/{courseId}/activities` แล้วเห็นสื่อฝึก practice-only ของ `SMAC001`
- [ ] เข้า score page แล้วเห็นเฉพาะคะแนนของตัวเอง
- [ ] เข้า `/admin` ไม่ได้

### Non-roster student

- [ ] logout จาก student
- [ ] login ด้วยปุ่ม `นักศึกษานอก roster`
- [ ] เข้า `/student` ได้แต่ไม่เห็นรายวิชา
- [ ] เข้า `/admin` ไม่ได้

## Command checks

ต้องรันและผ่านก่อน preview deploy:

```bash
npm run lint
npm run build
npm test
```

## ข้อควรจำ

- Local QA ใช้ emulator เพื่อทดสอบ logic และ flow
- Preview deploy ใช้ Firebase project dev และ Google login จริงเป็น smoke test เท่านั้น
- Production deploy ยังต้องขออนุญาตชัดเจนก่อนเสมอ
- XP, badges และ interactive learning ยังไม่ควรนับเป็นคะแนนจริงจนกว่าจะมี trusted grading flow
