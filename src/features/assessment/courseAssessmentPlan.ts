import type { Activity } from "../activities/activityTypes";
import type {
  ActivityAssessmentMapping,
  BadgeRule,
  CourseAssessmentTemplate,
  CourseLearningOutcome,
  CourseModule,
} from "./assessmentTypes";

export type SetupStep = {
  id: string;
  title: string;
  description: string;
  status: "ready" | "needsReview" | "later";
};

export type SelfAssessmentPrompt = {
  outcomeId: string;
  title: string;
  prompts: string[];
};

const smac001LearningOutcomes: CourseLearningOutcome[] = [
  {
    id: "SMAC001-CLO1",
    courseCode: "SMAC001",
    title: "ลิมิตและความต่อเนื่อง",
    description:
      "อธิบายแนวคิดพื้นฐานของลิมิตและความต่อเนื่องจากกราฟ ตาราง หรือข้อความทางคณิตศาสตร์ได้",
    bloomLevel: "understand",
    isCore: true,
    order: 1,
  },
  {
    id: "SMAC001-CLO2",
    courseCode: "SMAC001",
    title: "อนุพันธ์และอัตราการเปลี่ยนแปลง",
    description:
      "ใช้แนวคิดอนุพันธ์เพื่อคำนวณ วิเคราะห์ และตีความอัตราการเปลี่ยนแปลงเบื้องต้นได้",
    bloomLevel: "apply",
    isCore: true,
    order: 2,
  },
  {
    id: "SMAC001-CLO3",
    courseCode: "SMAC001",
    title: "ปริพันธ์และการสะสม",
    description:
      "ใช้ปริพันธ์พื้นฐานเพื่ออธิบายพื้นที่ ปริมาณสะสม และความสัมพันธ์กับอนุพันธ์ได้",
    bloomLevel: "apply",
    isCore: true,
    order: 3,
  },
  {
    id: "SMAC001-CLO4",
    courseCode: "SMAC001",
    title: "การให้เหตุผลทางคณิตศาสตร์",
    description:
      "สื่อสารเหตุผลทางคณิตศาสตร์จากกราฟ ตัวอย่าง แบบฝึก หรือสถานการณ์ได้อย่างเหมาะสม",
    bloomLevel: "analyze",
    isCore: true,
    order: 4,
  },
];

const smac001Modules: CourseModule[] = [
  {
    id: "smac001-foundation",
    courseCode: "SMAC001",
    title: "พื้นฐาน ลิมิต และความต่อเนื่อง",
    outcomeIds: ["SMAC001-CLO1", "SMAC001-CLO4"],
    order: 1,
  },
  {
    id: "smac001-derivative",
    courseCode: "SMAC001",
    title: "อนุพันธ์และการประยุกต์",
    outcomeIds: ["SMAC001-CLO2", "SMAC001-CLO4"],
    order: 2,
  },
  {
    id: "smac001-integral",
    courseCode: "SMAC001",
    title: "ปริพันธ์และการสะสม",
    outcomeIds: ["SMAC001-CLO3", "SMAC001-CLO4"],
    order: 3,
  },
];

const smac001ActivityMappings: ActivityAssessmentMapping[] = [
  {
    activityId: "calculus1-overview",
    courseCode: "SMAC001",
    outcomeId: "SMAC001-CLO1",
    bloomLevel: "understand",
    evidenceType: "completion",
    weight: 1,
    contributesToOfficialScore: false,
    reviewPolicy: "practiceOnly",
  },
  {
    activityId: "calculus1-visual-lessons",
    courseCode: "SMAC001",
    outcomeId: "SMAC001-CLO1",
    bloomLevel: "understand",
    evidenceType: "reflection",
    weight: 1,
    contributesToOfficialScore: false,
    reviewPolicy: "practiceOnly",
  },
  {
    activityId: "calculus1-interactive-tools",
    courseCode: "SMAC001",
    outcomeId: "SMAC001-CLO2",
    bloomLevel: "apply",
    evidenceType: "accuracy",
    weight: 1,
    contributesToOfficialScore: false,
    reviewPolicy: "autoPractice",
  },
  {
    activityId: "calculus1-games-and-missions",
    courseCode: "SMAC001",
    outcomeId: "SMAC001-CLO4",
    bloomLevel: "analyze",
    evidenceType: "rubric",
    weight: 1,
    contributesToOfficialScore: false,
    reviewPolicy: "manualReviewRequired",
  },
];

const smac001BadgeRules: BadgeRule[] = [
  {
    id: "smac001-concept-starter",
    courseCode: "SMAC001",
    title: "เริ่มเห็นภาพแคลคูลัส",
    description:
      "ได้รับเมื่อผู้เรียนทำกิจกรรมพื้นฐานและสะท้อนความเข้าใจเบื้องต้นครบตามเงื่อนไข",
    outcomeIds: ["SMAC001-CLO1"],
    requiredActivityIds: ["calculus1-overview", "calculus1-visual-lessons"],
    reviewRequired: false,
  },
  {
    id: "smac001-reasoning-practice",
    courseCode: "SMAC001",
    title: "ฝึกอธิบายเหตุผล",
    description:
      "ได้รับเมื่อผู้เรียนส่งภารกิจที่ต้องอธิบายเหตุผลและผ่านการตรวจเบื้องต้น",
    outcomeIds: ["SMAC001-CLO4"],
    requiredActivityIds: ["calculus1-games-and-missions"],
    reviewRequired: true,
  },
];

export const smac001AssessmentTemplate: CourseAssessmentTemplate = {
  courseCode: "SMAC001",
  courseTitle: "แคลคูลัส 1",
  academicYear: 2569,
  term: "ภาคการศึกษาที่ 1",
  sections: ["P01", "P02"],
  learningOutcomes: smac001LearningOutcomes,
  modules: smac001Modules,
  assessmentComponents: [
    {
      id: "smac001-practice-progress",
      courseCode: "SMAC001",
      title: "พัฒนาการจากกิจกรรมฝึก",
      type: "practice",
      description:
        "ใช้แสดงพัฒนาการระหว่างเรียน ยังไม่ถือเป็นคะแนนทางการจนกว่าจะมีการอนุมัติ",
      outcomeIds: smac001LearningOutcomes.map((outcome) => outcome.id),
      isOfficialScoreComponent: false,
      order: 1,
    },
    {
      id: "smac001-official-score",
      courseCode: "SMAC001",
      title: "คะแนนทางการจากอาจารย์",
      type: "other",
      description:
        "คะแนนจริงยังคงมาจากรายการคะแนนที่อาจารย์สร้างหรือ import ผ่านระบบคะแนน",
      outcomeIds: smac001LearningOutcomes.map((outcome) => outcome.id),
      isOfficialScoreComponent: true,
      order: 2,
    },
  ],
  activityMappings: smac001ActivityMappings,
  rubricCriteria: [],
  badgeRules: smac001BadgeRules,
};

export function getAssessmentTemplateForCourse(courseCode?: string) {
  const normalizedCourseCode = courseCode?.trim().toUpperCase();

  if (normalizedCourseCode === "SMAC001") {
    return smac001AssessmentTemplate;
  }

  return null;
}

export function getAssessmentSetupSteps(input: {
  hasCourseCode: boolean;
  hasTemplate: boolean;
  activityCount: number;
}): SetupStep[] {
  return [
    {
      id: "course",
      title: "ข้อมูลรายวิชา",
      description: input.hasCourseCode
        ? "พร้อมใช้สำหรับผูก template และ activity catalog"
        : "ควรใส่รหัสวิชาก่อน เพื่อเลือก template ได้ถูกต้อง",
      status: input.hasCourseCode ? "ready" : "needsReview",
    },
    {
      id: "clo",
      title: "CLO ของรายวิชา",
      description: input.hasTemplate
        ? "มี CLO draft สำหรับตรวจและแก้ภาษาให้ตรงกับ มคอ./เอกสารรายวิชา"
        : "ยังไม่มี CLO template สำหรับรายวิชานี้",
      status: input.hasTemplate ? "needsReview" : "later",
    },
    {
      id: "activities",
      title: "กิจกรรมและสื่อ",
      description:
        input.activityCount > 0
          ? `พบกิจกรรมที่เผยแพร่แล้ว ${input.activityCount} รายการ`
          : "ยังไม่มี activity catalog สำหรับรายวิชานี้",
      status: input.activityCount > 0 ? "ready" : "later",
    },
    {
      id: "assessment",
      title: "Mapping และ self-assessment",
      description: input.hasTemplate
        ? "พร้อมตรวจ mapping ระหว่างกิจกรรม CLO Bloom evidence และ dashboard"
        : "รอ CLO และกิจกรรมก่อนเริ่ม mapping",
      status: input.hasTemplate ? "needsReview" : "later",
    },
  ];
}

export function buildSelfAssessmentPrompts(
  outcomes: Array<{ id: string; title: string }>,
): SelfAssessmentPrompt[] {
  return outcomes.map((outcome) => ({
    outcomeId: outcome.id,
    title: outcome.title,
    prompts: [
      `ฉันอธิบายเรื่อง${outcome.title}ด้วยคำของตนเองได้`,
      `ฉันทำแบบฝึกหรือกิจกรรมที่เกี่ยวกับ${outcome.title}ได้โดยต้องดูตัวอย่างน้อยลง`,
      "ฉันบอกได้ว่ายังติดปัญหาตรงไหนและต้องการความช่วยเหลือเรื่องใด",
    ],
  }));
}

export function countPracticeOnlyMappings(mappings: ActivityAssessmentMapping[]) {
  return mappings.filter((mapping) => !mapping.contributesToOfficialScore).length;
}

export function findMappedActivity(
  activities: Activity[],
  activityId: string,
) {
  return activities.find((activity) => activity.id === activityId);
}
