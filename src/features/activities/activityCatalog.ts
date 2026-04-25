import type { Activity } from "./activityTypes";

type CatalogActivity = Omit<Activity, "courseId">;

const calculusBaseUrl = "https://lordtd-hub.github.io/calculus1-thai/index.html";

const activityCatalogByCourseCode: Record<string, CatalogActivity[]> = {
  SMAC001: [
    {
      id: "calculus1-overview",
      title: "แคลคูลัส 1 ภาษาไทย",
      description:
        "สื่อหลักสำหรับทบทวนแนวคิดแคลคูลัส 1 แบบเรียนรู้ด้วยตนเอง ใช้เป็นพื้นที่ฝึกและสำรวจแนวคิดก่อนหรือหลังเรียน",
      type: "external",
      visibility: "enrolled",
      scoringMode: "practice",
      xp: 0,
      outcomes: ["practice-calculus-foundation"],
      sourceUrl: calculusBaseUrl,
      isPublished: true,
      order: 1,
    },
    {
      id: "calculus1-visual-lessons",
      title: "บทเรียนเชิงภาพและกราฟ",
      description:
        "ชุดบทเรียนและภาพประกอบสำหรับช่วยมองเห็นแนวคิดของลิมิต ความต่อเนื่อง อนุพันธ์ และปริพันธ์",
      type: "lesson",
      visibility: "enrolled",
      scoringMode: "practice",
      xp: 0,
      outcomes: ["practice-conceptual-understanding"],
      sourceUrl: calculusBaseUrl,
      isPublished: true,
      order: 2,
    },
    {
      id: "calculus1-interactive-tools",
      title: "เครื่องมือ interactive สำหรับลองคิด",
      description:
        "พื้นที่ฝึกปรับค่า สังเกตกราฟ และทดลองแนวคิดเชิงคำนวณ โดยผลจากสื่อนี้ยังไม่ถือเป็นคะแนนทางการ",
      type: "interactive",
      visibility: "enrolled",
      scoringMode: "practice",
      xp: 0,
      outcomes: ["practice-exploration"],
      sourceUrl: calculusBaseUrl,
      isPublished: true,
      order: 3,
    },
    {
      id: "calculus1-games-and-missions",
      title: "เกมและภารกิจฝึกคิด",
      description:
        "กิจกรรมแนวเกมและภารกิจ OBE/Bloom สำหรับฝึกอธิบายเหตุผลและตรวจความเข้าใจเบื้องต้นแบบไม่ผูกกับคะแนนจริง",
      type: "mission",
      visibility: "enrolled",
      scoringMode: "practice",
      xp: 0,
      outcomes: ["practice-reasoning"],
      sourceUrl: calculusBaseUrl,
      isPublished: true,
      order: 4,
    },
  ],
};

export function getPublishedActivitiesForCourse(input: {
  courseCode?: string;
  courseId: string;
}) {
  const courseCode = input.courseCode?.trim().toUpperCase();

  if (!courseCode) {
    return [];
  }

  return (activityCatalogByCourseCode[courseCode] ?? [])
    .filter((activity) => activity.isPublished)
    .sort((first, second) => first.order - second.order)
    .map<Activity>((activity) => ({
      ...activity,
      courseId: input.courseId,
    }));
}

export function countPublishedActivitiesForCourse(courseCode?: string) {
  const normalizedCourseCode = courseCode?.trim().toUpperCase();

  if (!normalizedCourseCode) {
    return 0;
  }

  return (activityCatalogByCourseCode[normalizedCourseCode] ?? []).filter(
    (activity) => activity.isPublished,
  ).length;
}
