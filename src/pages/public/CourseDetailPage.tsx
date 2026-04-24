import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { publicCourses } from "../../content/publicAcademic";

export function CourseDetailPage() {
  const { slug } = useParams();
  const course = publicCourses.find((item) => item.slug === slug);

  if (!course) {
    return (
      <PageShell
        eyebrow="รายละเอียดรายวิชา"
        title="ไม่พบข้อมูลรายวิชา"
        description="ระบบยังไม่มีข้อมูล public metadata สำหรับรายวิชาที่ร้องขอ"
      >
        <Link className="button-primary" to="/courses">
          กลับไปหน้ารายวิชา
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="รายละเอียดรายวิชา"
      title={course.title}
      description={course.overview}
    >
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="info-panel self-start">
          <p className="metadata-label">{course.code}</p>
          <h2>ภาพรวมสำหรับเผยแพร่</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">ภาคการศึกษา</dt>
              <dd className="mt-1 text-ink/65">{course.term}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">ผู้เรียน</dt>
              <dd className="mt-1 text-ink/65">{course.audience}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-6 text-ink/65">
            หน้านี้มีเฉพาะข้อมูลรายวิชาที่เผยแพร่ได้เท่านั้น คะแนน enrollment
            และ feedback ส่วนตัวของนักศึกษาไม่ถูกเก็บไว้ในส่วน public
          </p>
        </aside>

        <div className="grid gap-6">
          <section className="info-panel">
            <h2>หัวข้อการเรียนรู้</h2>
            <ul className="mt-4 space-y-3">
              {course.syllabus.map((item) => (
                <li className="check-row" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="info-panel">
            <h2>แผนการเรียนรายสัปดาห์</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.weeklyLessons.map((lesson) => (
                <div className="lesson-tile" key={lesson}>
                  {lesson}
                </div>
              ))}
            </div>
          </section>

          <section className="info-panel">
            <h2>สื่อประกอบการเรียน</h2>
            <ul className="mt-4 space-y-3">
              {course.resources.map((resource) => (
                <li className="resource-row" key={resource}>
                  {resource}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
