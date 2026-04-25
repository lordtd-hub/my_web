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

## XP, Badges, and CLO Attainment

ผู้ใช้ต้องการใช้ XP และ badges เป็นเครื่องมือวัดพัฒนาการและการบรรลุ CLOs ของนักศึกษาแต่ละคนในรายวิชาที่สอน แนวคิดนี้เหมาะกับระบบ แต่ต้องปิดจุดอ่อนของ XP/localStorage แบบเดิมก่อนนำไปใช้เป็นหลักฐานเชิงประเมิน

หลักการที่ควรใช้:

- XP คือหลักฐานความก้าวหน้าเชิงพฤติกรรม เช่น ทำกิจกรรมครบ ส่งงานตามขั้นตอน หรือฝึกซ้ำจนผ่านเกณฑ์
- Badge คือ milestone ของ CLO หรือกลุ่มทักษะ เช่น เข้าใจนิยาม วิเคราะห์กราฟ แก้ปัญหาประยุกต์ หรืออธิบายเหตุผลได้
- CLO attainment ควรคำนวณจาก `activityAttempts` ที่ผูกกับ Firebase Auth UID และกิจกรรมที่ map กับ CLO ชัดเจน
- `studentProgress.outcomeProgress` ใช้แสดงภาพรวมรายบุคคล เช่น `CLO1: 80%`, `CLO2: 55%`
- XP/Badge ใช้เป็น progress indicator ได้ทันที แต่ถ้าจะนับเป็นคะแนนเก็บหรือคะแนนทางการต้องผ่าน admin review หรือ trusted grading flow

จุดอ่อนที่ต้องปิด:

- ห้ามเชื่อ localStorage เป็นหลักฐานทางการ เพราะผู้เรียนแก้ไขเองได้
- ห้ามให้ browser เขียนคะแนนทางการเองจาก XP หรือ badge โดยตรง
- ห้ามคำนวณ CLO attainment จากจำนวนคลิกหรือเวลาที่อยู่ในหน้าเพียงอย่างเดียว
- ต้องกันการ submit ซ้ำเพื่อปั่น XP ด้วย attempt limits, idempotency หรือเกณฑ์ให้ XP เฉพาะครั้งแรกที่ผ่าน
- ต้องเก็บเฉพาะข้อมูลที่จำเป็นต่อการประเมิน ไม่เก็บข้อมูลส่วนตัวเกินจำเป็น
- ต้องให้ผู้เรียนเห็นเฉพาะ progress/CLO ของตนเอง และ admin เห็นภาพรวมเฉพาะรายวิชาที่จัดการ

รูปแบบที่แนะนำ:

```text
Activity -> maps to CLOs and badge criteria
ActivityAttempt -> stores verifiable learner action/result
StudentProgress -> aggregates XP, badges, CLO progress
StudentScores -> official score only after review/trusted transfer
```

ตัวอย่าง:

```ts
type CourseLearningOutcome = {
  id: "CLO1" | "CLO2" | string;
  title: string;
  description: string;
};

type ActivityOutcomeMapping = {
  outcomeId: string;
  weight: number;
  minimumEvidence: "complete" | "accuracy" | "rubric" | "manualReview";
};

type BadgeRule = {
  id: string;
  title: string;
  outcomeId?: string;
  criteria: {
    minimumProgress?: number;
    requiredActivityIds?: string[];
    minimumAccuracy?: number;
    reviewRequired?: boolean;
  };
};
```

สำหรับ phase แรกของ CLO dashboard ควรเริ่มจาก practice-only:

1. แสดง XP/badges/CLO progress ในหน้า learner dashboard
2. เก็บ attempt/progress ใน Firestore เฉพาะของผู้เรียนที่ authenticated และ enrolled
3. ยังไม่ส่งเข้า `studentScores`
4. เพิ่มหน้า admin ให้ review progress ก่อนตัดสินใจว่าจะโอนเป็น score item หรือไม่

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

1. เพิ่ม activity catalog แบบอ่านอย่างเดียว — ทำแล้วใน route `/student/courses/:courseId/activities`
2. เพิ่ม activity detail/player สำหรับ enrolled learners
3. เก็บ practice attempts และ student progress
4. เพิ่ม learner dashboard สำหรับพัฒนาการ
5. เพิ่ม admin review/transfer progress เป็น score item เมื่อจำเป็น
6. พิจารณา trusted grading flow หากต้องมี auto-graded official scores

## Current Activity Catalog Implementation

Phase แรกเพิ่ม catalog ในโค้ดที่:

```text
src/features/activities/activityCatalog.ts
src/pages/student/StudentCourseActivitiesPage.tsx
```

ขอบเขตปัจจุบัน:

- map activities ด้วย `courseCode` เช่น `SMAC001` เพื่อไม่ผูกกับ Firestore document ID จริง
- แสดงเฉพาะผู้เรียนที่มี enrollment ในรายวิชานั้นจาก `/student/courses/:courseId/activities`
- รายการทั้งหมดเป็น `scoringMode: "practice"`
- ยังไม่เขียน `activityAttempts`
- ยังไม่สร้างหรือแก้ `studentProgress`
- ยังไม่ส่งคะแนนเข้า `studentScores`
- external media ยังใช้ source URL ของ `calculus1-thai` เป็น launcher เท่านั้น

## Inspiration: calculus1-thai

สื่อ `แคลคูลัส 1 ภาษาไทย` ใน repo `lordtd-hub/calculus1-thai` เป็นแนวทางที่ผู้ใช้ชอบและควรใช้เป็นต้นแบบเชิงประสบการณ์สำหรับ phase interactive learning ของ portal นี้

ลักษณะสำคัญที่ควรเก็บไว้เป็นแนวคิด:

- แบ่งเนื้อหาเป็นหน้า/กิจกรรมตามหัวข้อ เช่น ลิมิต ความต่อเนื่อง อนุพันธ์ ปริพันธ์ แอปประยุกต์ เกม และภารกิจ
- ใช้การเรียนแบบเล่นได้ มีภาพ/กราฟ interactive ให้ผู้เรียนลองปรับค่าและสังเกตผล
- มี XP, badges, progress, accuracy และ game counters เพื่อสร้างแรงจูงใจ
- มีภารกิจที่ออกแบบด้วย OBE/Bloom และ rubric เพื่อวัดมากกว่าการคำนวณตามสูตร
- เก็บ progress แบบ practice ใน browser localStorage ของสื่อนั้นเอง
- ยังไม่ควรนำ XP หรือผลจาก localStorage ไปเป็นคะแนนทางการโดยตรง

แนวทางเชื่อมกับ portal:

1. ระยะสั้น: เก็บเป็น external interactive learning resource สำหรับ `SMAC001 แคลคูลัส 1`
2. ระยะกลาง: map แต่ละหน้าเป็น `Activity` type เช่น `lesson`, `interactive`, `game`, `mission`, `external`
3. ระยะกลาง: ให้ portal แสดง activity catalog และเปิดสื่อจาก source URL โดยยังถือเป็น practice
4. ระยะยาว: หากต้องเก็บ progress รวมใน portal ให้ย้ายผลลัพธ์เข้าสู่ `activityAttempts` และ `studentProgress` ด้วย Firebase Auth UID
5. คะแนนทางการยังต้องผ่าน `studentScores/{uid}` โดย admin หรือ trusted grading flow เท่านั้น

ข้อควรระวัง:

- สื่อเดิมใช้ `localStorage` และเหมาะกับ practice/self-paced learning แต่ยังไม่ใช่แหล่งข้อมูลที่เชื่อถือได้สำหรับคะแนนจริง
- หากย้ายไฟล์เข้า repo หลัก ต้องตรวจ relative paths, CDN dependencies, localStorage keys และ asset paths ก่อน
- หากคงเป็น GitHub Pages แยก repo ให้ portal ทำหน้าที่เป็น hub/launcher และระบบคะแนนยังอยู่ใน Firestore ของ portal
