# Firestore Schema

เอกสารนี้อธิบาย schema ของ Cloud Firestore ที่ใช้คุ้มครองข้อมูลคะแนนนักศึกษา

หลักสำคัญคือ คะแนนต้องอยู่ใน Firestore เท่านั้น และต้องถูกป้องกันด้วย Firestore Security Rules

## Collections

```text
admins/{uid}
users/{uid}
courses/{courseId}
courses/{courseId}/enrollments/{uid}
courses/{courseId}/announcements/{announcementId}
courses/{courseId}/scoreItems/{scoreItemId}
courses/{courseId}/studentScores/{uid}
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
  term: string;
  year: number;
  description: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

`isPublic` ใช้บอกว่าผู้เข้าชมทั่วไปอ่านข้อมูลรายวิชานี้ได้หรือไม่

## courses/{courseId}/enrollments/{uid}

ข้อมูลการลงทะเบียนของนักศึกษาในแต่ละรายวิชา

```ts
{
  uid: string;
  studentId: string;
  displayName: string;
  email: string;
  status: "active" | "inactive";
  createdAt: Timestamp;
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

## การเขียนข้อมูลจาก Admin CSV import

Milestone 5 เขียนข้อมูลหลังจาก admin preview และ confirm import แล้วเท่านั้น:

```text
courses/{courseId}/scoreItems/{scoreItemId}
courses/{courseId}/studentScores/{uid}
```

ระบบจะเขียนเฉพาะ row ที่ match `studentId` หรือ `email` กับ enrollment ที่มีอยู่ใน `courses/{courseId}/enrollments/{uid}` แล้วเท่านั้น

enrollment document ID คือ Firebase Auth UID เดียวกับที่ใช้เป็น student score document ID

## ห้ามใช้รูปแบบเหล่านี้

```text
scores/{studentId}
public/scores.json
courses/calculus/scores.csv
markdown files containing grades
localStorage containing grades
```

รูปแบบข้างต้นเสี่ยงต่อการเปิดเผยคะแนนหรือทำให้เดา path ได้ง่าย จึงไม่ควรใช้ในโครงการนี้
