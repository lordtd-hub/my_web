# Firestore Schema

เอกสารนี้อธิบาย schema ของ Cloud Firestore ที่ใช้คุ้มครองข้อมูลคะแนนนักศึกษา

หลักสำคัญคือ คะแนนต้องอยู่ใน Firestore เท่านั้น และต้องถูกป้องกันด้วย Firestore Security Rules

## Collections

```text
admins/{uid}
users/{uid}
courses/{courseId}
courses/{courseId}/roster/{studentId}
courses/{courseId}/enrollments/{uid}
courses/{courseId}/announcements/{announcementId}
courses/{courseId}/scoreItems/{scoreItemId}
courses/{courseId}/studentScores/{uid}
courses/{courseId}/learningOutcomes/{outcomeId}
courses/{courseId}/selfAssessments/{uid}
```

ห้ามแปล collection names หรือ document paths เหล่านี้ เพราะเป็นส่วนหนึ่งของ schema และ Security Rules

## admins/{uid}

เอกสาร allowlist สำหรับ admin

```ts
{
  email: string;
  createdAt: Timestamp;
}
```

ข้อสำคัญ:

- นักศึกษาต้องสร้าง admin document ไม่ได้
- admin access ต้องไม่อิง role field ที่ผู้ใช้แก้เองได้
- การเป็น admin ตรวจจากการมีเอกสาร `admins/{uid}`

## users/{uid}

ข้อมูล profile ของผู้ใช้

```ts
{
  email: string;
  displayName: string;
  studentId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`studentId` เป็น metadata เท่านั้น ไม่ควรใช้เป็น document ID สำหรับคะแนน เพราะอาจเดาได้

## courses/{courseId}

metadata ของรายวิชา

```ts
{
  title: string;
  slug: string;
  courseCode?: string;
  term: string;
  year: number;
  description: string;
  isPublic: boolean;
  portalEnabled?: boolean;
  sections?: string[];
  status?: "draft" | "active" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`isPublic` ใช้บอกว่าผู้เข้าชมทั่วไปอ่านข้อมูลรายวิชานี้ได้หรือไม่

`portalEnabled` ใช้บอกว่ารายวิชานี้ถูกใช้ในพื้นที่ผู้เรียนและแดชบอร์ดอาจารย์จริงหรือเป็นเพียง public summary

`sections` เก็บกลุ่มเรียนที่ใช้ในรายวิชานั้น เช่น `P01`, `P02` หรือ `N01` แต่ไม่ควรสร้าง course แยกหาก section เรียนร่วมกัน ใช้สื่อร่วมกัน และใช้คะแนนชุดเดียวกัน

`status` ใช้จัดวงจรชีวิตรายวิชา:

```text
draft    = กำลังเตรียมข้อมูล ยังไม่พร้อมใช้จริง
active   = ใช้งานในภาคเรียนปัจจุบัน
archived = จบภาคเรียนหรือเก็บไว้ดูย้อนหลัง
```

## courses/{courseId}/roster/{studentId}

รายชื่อผู้เรียนที่มีสิทธิ์เข้าใช้รายวิชานี้จาก registrar หรือการกรอกโดยอาจารย์

```ts
{
  studentId: string;
  email: string;
  displayName?: string;
  section?: string;
  status: "active" | "inactive";
  source: "registrar-import" | "manual";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Document ID คือ `studentId` 13 หลัก

สำหรับนักศึกษา SRU ใช้ email รูปแบบ:

```text
{studentId}@student.sru.ac.th
```

roster ใช้เป็น allowlist ก่อนนักศึกษามี Firebase Auth UID เมื่อนักศึกษา login ด้วย email นักศึกษา ระบบจึง link เป็น enrollment ที่ `courses/{courseId}/enrollments/{uid}` โดยใช้ Firebase Auth UID เป็น document ID

ห้ามใช้ roster เป็นคะแนนหรือข้อมูลผลการเรียน

## courses/{courseId}/enrollments/{uid}

ข้อมูลการลงทะเบียนของนักศึกษาในแต่ละรายวิชา

```ts
{
  uid: string;
  studentId: string;
  displayName: string;
  email: string;
  section?: string;
  source?: "admin" | "student-self-link";
  status: "active" | "inactive";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

Document ID ควรเป็น Firebase Auth UID

`uid` field ใช้ช่วย query enrollment แบบ collection group ในพื้นที่ผู้เรียนของรายวิชา field นี้ต้องถูกเขียนโดย admin เท่านั้น ไม่ใช่ข้อมูลที่นักศึกษาแก้เองได้

## courses/{courseId}/announcements/{announcementId}

ประกาศของรายวิชา

```ts
{
  title: string;
  body: string;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

นักศึกษาควรเห็นเฉพาะประกาศที่ publish แล้วและอยู่ในรายวิชาที่ตนลงทะเบียน

## courses/{courseId}/scoreItems/{scoreItemId}

metadata ของรายการคะแนน เช่น quiz, homework, midterm หรือ final

```ts
{
  title: string;
  maxScore: number;
  weight?: number;
  category: "quiz" | "homework" | "midterm" | "final" | "attendance" | "other";
  isPublished: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`isPublished` ใช้ควบคุมการแสดง metadata ของ score item ให้กับนักศึกษา

## courses/{courseId}/learningOutcomes/{outcomeId}

CLO หรือผลลัพธ์การเรียนรู้ของรายวิชา ใช้เป็นฐานสำหรับ activity mapping, self-assessment และ dashboard พัฒนาการ

```ts
{
  title: string;
  description: string;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

admin อ่าน/เขียนได้ นักศึกษาที่ enroll แล้วอ่านได้เฉพาะ CLO ที่ `isPublished == true`

## courses/{courseId}/selfAssessments/{uid}

คำตอบประเมินตนเองของผู้เรียนต่อ CLO ในรายวิชานั้น

```ts
{
  uid: string;
  courseId: string;
  responses: {
    [outcomeId: string]: {
      rating: number;
      reflection: string;
      updatedAt: Timestamp;
    }
  };
  updatedAt: Timestamp;
}
```

Document ID ต้องเป็น Firebase Auth UID ของผู้เรียน นักศึกษาเขียนได้เฉพาะเอกสารของตนเองและต้องเป็นผู้ที่ enroll ในรายวิชานั้นแล้ว admin อ่านได้เพื่อดูภาพรวม แต่ข้อมูลนี้ยังไม่ใช่คะแนนทางการและไม่เขียนเข้า `studentScores`

## courses/{courseId}/studentScores/{uid}

คะแนนของนักศึกษา 1 คนในรายวิชา 1 รายวิชา

```ts
{
  uid: string;
  courseId: string;
  scores: {
    [scoreItemId: string]: {
      score: number | null;
      maxScore: number;
      feedback?: string;
      published: boolean;
      updatedAt: Timestamp;
    }
  };
  updatedAt: Timestamp;
}
```

Document ID ต้องเป็น Firebase Auth UID ของนักศึกษา

## เหตุผลที่ใช้ studentScores/{uid}

รูปแบบนี้ช่วยให้ Security Rules เขียนได้ตรงและตรวจง่าย:

```text
Student can read only courses/{courseId}/studentScores/{request.auth.uid}
```

ห้ามใช้ student ID เป็น document ID ของคะแนน เพราะ student ID อาจเดาได้และอาจทำให้เกิดความเสี่ยงด้านความเป็นส่วนตัว

## Client references

Milestone 3 เพิ่ม typed Firestore client references ใน:

```text
src/lib/firestore/types.ts
src/lib/firestore/refs.ts
```

helpers เหล่านี้สะท้อน schema นี้เท่านั้น ไม่ควรมีข้อมูลนักศึกษาจริง คะแนนจริง หรือ static score records

## การอ่านข้อมูลในพื้นที่ผู้เรียนของรายวิชา

Milestone 4 ใช้รูปแบบการอ่านข้อมูลต่อไปนี้:

```text
collectionGroup("enrollments") constrained to the signed-in auth.uid via the `uid` field
courses/{courseId}
courses/{courseId}/scoreItems
courses/{courseId}/studentScores/{auth.uid}
```

score document ID ต้องมาจาก Firebase Auth UID ของ session ปัจจุบันเสมอ ไม่อ่านจาก URL parameter หรือข้อมูลที่นักศึกษากรอกเอง

Enrollment document IDs ควรยังคงเป็น Firebase Auth UID ส่วนพื้นที่ผู้เรียนของรายวิชาใช้ `uid` field สำหรับ collection group lookup เพราะ Firestore collection group `documentId()` filters ต้องใช้ path-shaped values ไม่ใช่ leaf UID

Student portal ต้องมี Firestore index สำหรับ `collectionGroup("enrollments")` + `uid ASC` ตาม `firestore.indexes.json`

หากยังไม่มี enrollment แต่มี roster ที่ email ตรงกับ Firebase Auth email ของผู้เรียน ระบบสามารถ link enrollment ให้เองได้ โดยยังต้องผ่าน Firestore Security Rules ที่ตรวจว่า roster ของรายวิชานั้นมี email และ studentId ตรงกัน

## การเขียนข้อมูลจาก Admin CSV import

Milestone 5 เขียนข้อมูลหลังจาก admin preview และ confirm import แล้วเท่านั้น:

```text
courses/{courseId}/scoreItems/{scoreItemId}
courses/{courseId}/studentScores/{uid}
```

ระบบจะเขียนเฉพาะ row ที่ match `studentId` หรือ `email` กับ enrollment ที่มีอยู่ใน `courses/{courseId}/enrollments/{uid}` แล้วเท่านั้น

enrollment document ID คือ Firebase Auth UID เดียวกับที่ใช้เป็น student score document ID

## การ import roster จากรหัสนักศึกษา

แดชบอร์ดอาจารย์รองรับการ import roster จาก CSV สำหรับรายวิชา โดยใช้ข้อมูลหลังเพิ่ม-ถอนนิ่งแล้วเท่านั้น

รูปแบบที่รองรับ:

```csv
studentId,section,displayName,status
6612345678901,P01,,active
6612345678902,P02,,active
```

ข้อกำหนด:

- `studentId` ต้องเป็นตัวเลข 13 หลัก
- `email` ไม่ต้องอยู่ในไฟล์ เพราะระบบสร้างจาก `{studentId}@student.sru.ac.th`
- `section`, `displayName`, `status` เป็น optional
- `status` เว้นว่างได้และจะถือว่า `active`
- ไฟล์ roster CSV ไม่ใช่ไฟล์คะแนน และห้ามใส่คะแนนใน flow นี้
- ระบบ preview แถวที่พร้อมนำเข้าและแถวที่ข้ามก่อนเขียน Firestore
- แถวที่นำเข้าเขียนไปที่ `courses/{courseId}/roster/{studentId}` ด้วย `source: "registrar-import"`

## ห้ามใช้รูปแบบเหล่านี้

```text
scores/{studentId}
public/scores.json
courses/calculus/scores.csv
markdown files containing grades
localStorage containing grades
```

รูปแบบข้างต้นเสี่ยงต่อการเปิดเผยคะแนนหรือทำให้เดา path ได้ง่าย จึงไม่ควรใช้ในโครงการนี้
