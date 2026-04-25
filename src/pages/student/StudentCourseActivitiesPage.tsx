import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { getPublishedActivitiesForCourse } from "../../features/activities/activityCatalog";
import type { ActivityType } from "../../features/activities/activityTypes";
import { useStudentCourses } from "../../features/courses/useStudentCourses";

function formatActivityType(type: ActivityType) {
  const labels: Record<ActivityType, string> = {
    external: "สื่อภายนอก",
    game: "เกมฝึกคิด",
    interactive: "Interactive",
    lesson: "บทเรียน",
    mission: "ภารกิจ",
    quiz: "แบบฝึก",
  };

  return labels[type];
}

export function StudentCourseActivitiesPage() {
  const { courseId } = useParams();
  const { courses, error, isLoading } = useStudentCourses();
  const studentCourse = courses.find((item) => item.courseId === courseId);
  const activities = studentCourse?.course
    ? getPublishedActivitiesForCourse({
        courseCode: studentCourse.course.courseCode,
        courseId: studentCourse.courseId,
      })
    : [];

  return (
    <PageShell
      eyebrow="รายวิชาของฉัน"
      title="สื่อและกิจกรรมฝึก"
      description="พื้นที่รวมสื่อฝึกของรายวิชานี้ ใช้เพื่อฝึกและติดตามแนวคิดเท่านั้น ยังไม่ถือเป็นคะแนนทางการ"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link className="text-link" to="/student/courses">
          กลับไปรายวิชาของฉัน
        </Link>
        {courseId ? (
          <Link className="text-link" to={`/student/courses/${courseId}/scores`}>
            ดูคะแนนของฉัน
          </Link>
        ) : null}
        {courseId ? (
          <Link
            className="text-link"
            to={`/student/courses/${courseId}/self-assessment`}
          >
            ประเมินตนเอง
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <div className="info-panel">
          <h2>กำลังโหลดรายวิชา</h2>
          <p>กำลังตรวจสอบรายวิชาที่ผูกกับบัญชีของท่าน...</p>
        </div>
      ) : null}

      {error ? <p className="alert-message">{error}</p> : null}

      {!isLoading && !error && !studentCourse ? (
        <div className="info-panel">
          <h2>ไม่พบรายวิชานี้ในบัญชีของท่าน</h2>
          <p>
            ระบบจะแสดงสื่อเฉพาะรายวิชาที่บัญชีของท่านถูกเพิ่มเข้าไว้แล้วเท่านั้น
          </p>
        </div>
      ) : null}

      {studentCourse ? (
        <div className="grid gap-6">
          <section className="info-panel">
            <p className="metadata-label">
              {studentCourse.course?.courseCode ?? "รอรหัสรายวิชา"}
            </p>
            <h2>{studentCourse.course?.title ?? "รอชื่อรายวิชา"}</h2>
            <p>
              กิจกรรมในหน้านี้เป็น practice-only ยังไม่เขียนคะแนน ไม่บันทึก XP
              และไม่นำผลจากสื่อภายนอกมาเป็นคะแนนทางการโดยอัตโนมัติ
            </p>
          </section>

          {activities.length === 0 ? (
            <div className="info-panel">
              <h2>ยังไม่มีสื่อฝึกที่เผยแพร่สำหรับรายวิชานี้</h2>
              <p>
                เมื่ออาจารย์เพิ่ม activity catalog ของรายวิชานี้ รายการสื่อจะปรากฏในหน้านี้
              </p>
            </div>
          ) : (
            <section className="content-grid">
              {activities.map((activity) => (
                <article className="info-panel" key={activity.id}>
                  <p className="metadata-label">
                    {formatActivityType(activity.type)}
                  </p>
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-ink">สถานะคะแนน</dt>
                      <dd className="mt-1 text-ink/65">ฝึกเท่านั้น</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">XP</dt>
                      <dd className="mt-1 text-ink/65">
                        ยังไม่บันทึกในระบบคะแนน
                      </dd>
                    </div>
                  </dl>
                  {activity.sourceUrl ? (
                    <a
                      className="button-primary mt-5"
                      href={activity.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      เปิดสื่อฝึก
                    </a>
                  ) : null}
                </article>
              ))}
            </section>
          )}
        </div>
      ) : null}
    </PageShell>
  );
}
