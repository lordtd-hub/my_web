# Activity Model

เอกสารนี้วาง contract กลางสำหรับสื่อการสอนและกิจกรรม interactive ในรายวิชาที่อาจารย์สิทธิโชค ทรงสอาด เป็นผู้สอน

เป้าหมายคือให้เพิ่มรายวิชา สื่อการสอน เกม แบบฝึกหัด หรือภารกิจใหม่ได้โดยใช้พื้นฐานระบบเดิม ไม่ต้องแก้ UI, Firestore access layer หรือ Security Rules แบบกระจัดกระจายทุกครั้ง

## หลักออกแบบ

- UI ไม่ควร hardcode กิจกรรมเฉพาะรายวิชาโดยตรง
- รายวิชา module และกิจกรรมควรอ่านผ่าน data contract กลาง
- interactive media ทุกแบบควรส่งผลลัพธ์กลับมาในรูป `ActivityResult`
- progress สำหรับการเรียนรู้ต้องแยกจากคะแนนทางการ
- คะแนนทางการยังอยู่ที่ `courses/{courseId}/studentScores/{uid}` และเขียนโดย admin หรือ trusted grading flow เท่านั้น
- ระบบนี้ไม่ใช่ระบบกลางของมหาวิทยาลัย แต่เป็นพื้นที่รายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอน

## Conceptual Data Model

```text
courses/{courseId}
courses/{courseId}/modules/{moduleId}
courses/{courseId}/activities/{activityId}
courses/{courseId}/activityAttempts/{attemptId}
courses/{courseId}/studentProgress/{uid}
courses/{courseId}/scoreItems/{scoreItemId}
courses/{courseId}/studentScores/{uid}
```

หมายเหตุ: paths สำหรับ `modules`, `activities`, `activityAttempts` และ `studentProgress` ยังเป็น proposal สำหรับ phase ถัดไป ยังไม่ใช่ schema ที่ deploy แล้ว

## Activity

```ts
type Activity = {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  type: "lesson" | "interactive" | "quiz" | "mission" | "game" | "external";
  visibility: "public" | "enrolled";
  scoringMode: "practice" | "manualReview" | "autoPractice" | "official";
  maxAttempts?: number;
  maxScore?: number;
  xp?: number;
  outcomes: string[];
  scoreItemId?: string;
  sourceUrl?: string;
  isPublished: boolean;
  order: number;
};
```

## Activity Result

```ts
type ActivityResult = {
  status: "started" | "submitted" | "completed";
  score?: number;
  maxScore?: number;
  accuracy?: number;
  xpEarned?: number;
  answers?: unknown;
  evidence?: unknown;
};
```

`answers` และ `evidence` ใช้สำหรับเก็บข้อมูลที่จำเป็นต่อการ review เท่านั้น ห้ามเก็บข้อมูลส่วนตัวที่ไม่จำเป็น

## Activity Attempt

```ts
type ActivityAttempt = {
  id: string;
  uid: string;
  courseId: string;
  activityId: string;
  status: "started" | "submitted" | "completed" | "reviewed" | "rejected";
  result: ActivityResult;
  createdAt: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
};
```

นักศึกษาควรเขียน attempt ได้เฉพาะของตนเอง และ `uid` ต้องตรงกับ Firebase Auth UID เสมอ

## Student Progress

```ts
type StudentProgress = {
  uid: string;
  courseId: string;
  completedActivities: string[];
  xp: number;
  badges: string[];
  outcomeProgress: Record<string, number>;
  updatedAt: Timestamp;
};
```

ข้อมูลนี้ใช้สำหรับ dashboard ส่วนตัวของผู้เรียน เช่น ความคืบหน้า ความแม่นยำ badge และ learning outcome progress

## Score Boundary

แบ่งข้อมูลเป็น 3 ชั้น:

```text
activityAttempts
หลักฐานการทำกิจกรรม เช่น คำตอบ attempt เวลา submit และผลจาก interactive media

studentProgress
ภาพรวมพัฒนาการส่วนตัว เช่น XP, badge, completion, outcome progress

studentScores
คะแนนทางการที่อาจารย์เผยแพร่แล้ว และนักศึกษาอ่านได้เฉพาะของตนเอง
```

ห้ามให้ browser เขียนคะแนนทางการโดยตรงจากคะแนนที่คำนวณเอง เว้นแต่มี trusted grading flow ที่ออกแบบและทดสอบ Security Rules แล้ว

## Adapter Pattern

interactive media แต่ละแบบควรมี adapter ที่พูดกับระบบด้วย contract เดียวกัน:

```ts
type ActivityAdapter = {
  type: Activity["type"];
  collectResult: () => ActivityResult;
  validateResult: (result: ActivityResult) => boolean;
};
```

ตัวอย่างที่ต่อยอดได้:

- Calculus lesson player
- graph visualizer
- limit guessing game
- graph-formula matching game
- OBE/Bloom mission
- external media link

## Roadmap Fit

MVP ปัจจุบันยังคงมีเฉพาะ public pages, login, learner course area, admin dashboard, CSV import และ score viewing

activity model นี้เป็นฐานสำหรับ phase ถัดไป:

1. เพิ่ม activity catalog แบบอ่านอย่างเดียว
2. เพิ่ม activity detail/player สำหรับ enrolled learners
3. เก็บ practice attempts และ student progress
4. เพิ่ม learner dashboard สำหรับพัฒนาการ
5. เพิ่ม admin review/transfer progress เป็น score item เมื่อจำเป็น
6. พิจารณา trusted grading flow หากต้องมี auto-graded official scores
