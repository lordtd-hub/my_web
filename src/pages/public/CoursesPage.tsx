import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { publicCourses } from "../../content/publicAcademic";

export function CoursesPage() {
  return (
    <PageShell
      eyebrow="รายวิชา"
      title="ภาพรวมรายวิชา"
      description="หน้านี้แสดงข้อมูลรายวิชาที่เผยแพร่ได้เท่านั้น ส่วนสื่อเฉพาะผู้เรียนและคะแนนนักศึกษาจะถูกคุ้มครองด้วย Firebase และ Firestore Security Rules"
    >
      <div className="content-grid">
        {publicCourses.map((course) => (
          <article className="info-panel" key={course.slug}>
            <p className="metadata-label">{course.code}</p>
            <h2>{course.title}</h2>
            <p>{course.summary}</p>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink">ภาคการศึกษา</dt>
                <dd className="mt-1 text-ink/65">{course.term}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">ผู้เรียน</dt>
                <dd className="mt-1 text-ink/65">{course.audience}</dd>
              </div>
            </dl>
            <Link className="text-link mt-4 inline-flex" to={`/courses/${course.slug}`}>
              ดูรายละเอียดรายวิชา
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
