# Assessment Model

เอกสารนี้วางแบบจำลองการวัดผลประเมินผลกลางสำหรับรายวิชาที่อาจารย์สิทธิโชค ทรงสอาด เป็นผู้สอน โดยออกแบบให้ `SMAC001 แคลคูลัส 1` เป็น pilot ได้ แต่รายวิชาอื่นควรเสียบเข้าระบบด้วย contract เดียวกัน

เป้าหมายคือเชื่อมการเรียนรู้แบบ interactive, XP, badge, dashboard และคะแนนทางการเข้ากับแนวคิด OBE, Bloom's taxonomy, CLO และหลักฐานที่ตรวจสอบได้ โดยไม่ทำให้คะแนนจริงถูกเขียนจาก browser แบบไม่น่าเชื่อถือ

## หลักออกแบบ

- รายวิชาแต่ละวิชาควรประกาศ CLO ของตัวเองผ่านโครงข้อมูลกลาง
- กิจกรรมทุกแบบควร map กับ CLO และ Bloom level อย่างชัดเจน
- XP และ badge ใช้บอกพัฒนาการได้ แต่ไม่ใช่คะแนนทางการโดยอัตโนมัติ
- คะแนนทางการยังอยู่ที่ `courses/{courseId}/studentScores/{uid}`
- หลักฐานจากกิจกรรมต้องแยกเป็น `activityAttempts` ก่อน
- การโอน progress เป็นคะแนนควรผ่าน admin review หรือ trusted grading flow ที่ออกแบบและทดสอบแล้ว
- dashboard ผู้เรียนควรตอบคำถามว่า “ตอนนี้ฉันบรรลุ CLO ใดระดับไหนแล้ว” ไม่ใช่แค่ “ฉันได้กี่แต้ม”

## System Layers

```text
Course Template
กำหนดรายวิชา, modules, CLO, grading policy และ activity groups

Activity Catalog
กำหนดสื่อ/กิจกรรม/ภารกิจที่ผู้เรียนทำได้

Assessment Mapping
บอกว่ากิจกรรมใดวัด CLO ใด, Bloom level ใด, ใช้ evidence แบบใด, น้ำหนักเท่าไร

Evidence and Attempts
เก็บหลักฐานการทำกิจกรรมของผู้เรียนแต่ละคน

Progress and Attainment
สรุป XP, badges, completion, CLO progress และระดับการบรรลุ

Official Scores
คะแนนที่อาจารย์เผยแพร่แล้วใน `studentScores/{uid}`
```

## Course Template

รายวิชาใหม่ไม่ควรต้องแก้ core UI มากนัก ควรเพิ่มข้อมูลตาม template:

```ts
type CourseAssessmentTemplate = {
  courseCode: string;
  courseTitle: string;
  academicYear: number;
  term: string;
  sections: string[];
  learningOutcomes: CourseLearningOutcome[];
  modules: CourseModule[];
  assessmentComponents: AssessmentComponent[];
  badgeRules: BadgeRule[];
};
```

ตัวอย่างเชิงโครงสร้างสำหรับ `SMAC001`:

```text
SMAC001 แคลคูลัส 1
- CLO1: อธิบายแนวคิดพื้นฐานของลิมิตและความต่อเนื่อง
- CLO2: ใช้อนุพันธ์เพื่อแก้ปัญหาและตีความผลลัพธ์
- CLO3: ใช้ปริพันธ์พื้นฐานและเชื่อมโยงกับพื้นที่/การสะสม
- CLO4: สื่อสารเหตุผลทางคณิตศาสตร์จากกราฟ ตาราง หรือสถานการณ์ได้
```

รายการข้างต้นเป็นร่างตัวอย่าง ยังไม่ใช่ CLO ทางการของรายวิชา ต้องให้ผู้ใช้ยืนยันก่อนนำไปใช้จริง

## CLO Model

```ts
type CourseLearningOutcome = {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  bloomLevel: BloomCognitiveLevel;
  attainmentTarget?: number;
  isCore: boolean;
};
```

`attainmentTarget` ใช้เป็น threshold เช่น 60, 70 หรือ 80 เปอร์เซ็นต์ แต่ต้องกำหนดตามนโยบายของรายวิชา ไม่ควรเดาเอง

## Bloom Levels

ใช้ Bloom revised taxonomy เป็นภาษากลางของกิจกรรม:

```text
remember   = จำ/ระบุ/นิยาม
understand = อธิบาย/ตีความ/เปรียบเทียบ
apply      = นำไปใช้แก้โจทย์
analyze    = วิเคราะห์โครงสร้าง เงื่อนไข หรือกรณี
evaluate   = ตรวจสอบ ให้เหตุผล ตัดสินความถูกต้อง
create     = สร้างวิธีแก้ คำอธิบาย แบบจำลอง หรือผลงานใหม่
```

ใน Cal1 กิจกรรม interactive ไม่ควรอยู่แค่ `remember` หรือ `apply` ทั้งหมด ภารกิจที่ให้ผู้เรียนอธิบายกราฟ เหตุผล หรือเปรียบเทียบวิธีคิดควรถูก map ไปที่ `analyze` หรือ `evaluate` ได้

## Assessment Mapping

กิจกรรมหนึ่งกิจกรรมอาจวัดหลาย CLO แต่ควรกำหนดน้ำหนักและ evidence ชัดเจน:

```ts
type ActivityAssessmentMapping = {
  activityId: string;
  courseCode: string;
  outcomeId: string;
  bloomLevel: BloomCognitiveLevel;
  evidenceType: AssessmentEvidenceType;
  weight: number;
  minimumPerformance?: number;
  contributesToOfficialScore: boolean;
  scoreItemId?: string;
  reviewPolicy: ReviewPolicy;
};
```

หลักสำคัญ:

- `contributesToOfficialScore: false` สำหรับ practice/progress ในช่วงแรก
- ถ้า `true` ต้องมี `scoreItemId` และ flow ตรวจสอบก่อนเขียน `studentScores`
- `reviewPolicy` ใช้บอกว่าต้องให้อาจารย์ตรวจหรือใช้ trusted auto-check ได้

## Evidence Types

หลักฐานควรเก็บเท่าที่จำเป็นต่อการเรียนรู้และการประเมิน:

```text
completion       = ทำกิจกรรมครบตามเงื่อนไข
accuracy         = ได้คะแนน/ความถูกต้องจากโจทย์ที่ตรวจได้
rubric           = ประเมินด้วย rubric
reflection       = คำอธิบายหรือเหตุผลสั้น ๆ ของผู้เรียน
artifact         = ผลงานหรือคำตอบที่ตรวจได้
teacherReview    = ต้องมีการตรวจยืนยันจากอาจารย์
```

ห้ามใช้จำนวนคลิก เวลาที่เปิดหน้า หรือ localStorage เป็นหลักฐานทางการโดยตรง

## Rubric Model

ภารกิจ OBE/Bloom ควรมี rubric ที่อธิบายระดับคุณภาพ ไม่ใช่มีแค่ถูก/ผิด:

```ts
type RubricCriterion = {
  id: string;
  title: string;
  outcomeId: string;
  bloomLevel: BloomCognitiveLevel;
  maxPoints: number;
  levels: RubricLevel[];
};
```

ตัวอย่าง rubric สำหรับ Cal1:

```text
เกณฑ์: อธิบายความหมายของอนุพันธ์จากกราฟ
- 0 คะแนน: ไม่ตอบหรือตอบไม่เกี่ยวข้อง
- 1 คะแนน: ระบุแนวคิดได้บางส่วนแต่ยังไม่เชื่อมกับกราฟ
- 2 คะแนน: อธิบาย slope/อัตราการเปลี่ยนแปลงได้ถูกต้อง
- 3 คะแนน: อธิบายพร้อมเหตุผลและตีความสถานการณ์ได้ชัดเจน
```

ตัวอย่างนี้เป็นแบบร่าง ไม่ใช่ rubric ทางการ

## Progress, XP, and Badges

XP และ badge ควรเป็น feedback loop สำหรับผู้เรียน:

```text
XP = ความพยายามและความต่อเนื่องที่ผ่านเงื่อนไข
Badge = milestone ของ CLO หรือกลุ่มทักษะ
CLO progress = สรุประดับการบรรลุจาก evidence ที่ผูกกับ CLO
Official score = คะแนนทางการที่อาจารย์ตรวจ/อนุมัติแล้ว
```

มาตรการกันจุดอ่อน:

- ให้ XP เฉพาะครั้งแรกที่ผ่านเกณฑ์ หรือใช้ diminishing returns
- กำหนด max attempts ต่อกิจกรรมที่มีผลต่อ progress
- เก็บ attempts ด้วย Firebase Auth UID และ enrollment เท่านั้น
- ไม่เชื่อผลจาก localStorage เป็น evidence ทางการ
- แยก progress dashboard ออกจากคะแนนจริงเสมอ

## Student Dashboard

dashboard รายวิชาควรแสดง:

- ภาพรวมกิจกรรมที่ทำแล้วและยังเหลือ
- progress ต่อ CLO
- Bloom distribution เพื่อให้เห็นว่าผู้เรียนฝึกระดับใดมาก/น้อย
- badge ที่ได้รับ
- feedback ล่าสุด
- คะแนนทางการเฉพาะที่ publish แล้ว

ข้อความใน UI ต้องสื่อชัดว่า progress/XP เป็น “พัฒนาการระหว่างเรียน” และคะแนนทางการเป็นอีกส่วนหนึ่ง

## Admin Review Flow

ก่อนให้ activity ใดมีผลต่อคะแนนจริง ควรมี flow นี้:

```text
Student submits activity
System stores activityAttempt
System updates studentProgress if allowed
Admin reviews evidence summary
Admin approves transfer
System writes/updates score item in studentScores
Student sees official published score
```

หากยังไม่มี trusted server-side grading flow ให้ admin เป็นผู้กดยืนยันก่อนเสมอ

## Fit for Multiple Courses

เมื่อเพิ่มรายวิชาใหม่ ให้ทำตามลำดับ:

1. สร้าง course metadata
2. ระบุ CLO ของรายวิชา
3. แบ่ง modules หรือ learning units
4. เพิ่ม activities ผ่าน contract กลาง
5. map activities กับ CLO/Bloom/evidence
6. กำหนด badge rules และ progress rules
7. ตัดสินใจว่า activity ใดเป็น practice และ activity ใดอาจโอนเป็นคะแนนจริง

Cal1 จึงเป็นเพียงรายวิชาแรกที่ใช้ระบบนี้ ไม่ใช่ระบบเฉพาะ Cal1

## Current Implementation Boundary

สถานะปัจจุบัน:

- มี activity catalog แบบอ่านอย่างเดียวสำหรับผู้เรียนที่ enroll แล้ว
- มี external resource สำหรับ `calculus1-thai`
- มีหน้า prototype ฝั่งอาจารย์ที่ `/admin/courses/:courseId/assessment` สำหรับดู CLO draft, activity mapping, self-assessment preview, badge draft และ official score boundary
- หน้า `/admin/courses/:courseId/assessment` เริ่มบันทึกและแก้ไข CLO ของรายวิชาใน Firestore ได้แล้ว
- หน้า `/student/courses/:courseId/self-assessment` ให้ผู้เรียนที่ enroll แล้วตอบ self-assessment ของตนเองตาม CLO ที่ publish แล้วได้
- ยังไม่เก็บ `activityAttempts`
- ยังไม่คำนวณ `studentProgress` จริง
- ยังไม่โอน XP/badge/progress เป็นคะแนนทางการ
- มี Firestore schema/rules ชุดแรกสำหรับ `learningOutcomes` และ `selfAssessments` แล้ว แต่ยังไม่สร้าง schema/rules สำหรับ attempts/progress/badge จริง

ขั้นถัดไปที่ปลอดภัย:

1. ยืนยัน CLO จริงของ `SMAC001 แคลคูลัส 1`
2. แตกสื่อ Cal1 เป็น activity list ตาม modules
3. map แต่ละ activity กับ CLO และ Bloom level
4. เพิ่ม summary ฝั่งอาจารย์จาก self-assessment โดยไม่แสดงข้อมูลเกินจำเป็น
5. ค่อยเพิ่ม `activityAttempts`, `studentProgress` และ badge persistence เมื่อ rules และ QA พร้อม
