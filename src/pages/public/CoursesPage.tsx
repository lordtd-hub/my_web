import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  interactiveLearningResources,
  publicCourses,
} from "../../content/publicAcademic";

export function CoursesPage() {
  return (
    <PageShell
      eyebrow="รายวิชา"
      title="ข้อมูลรายวิชาที่เผยแพร่ได้"
      description="หน้านี้แสดงเฉพาะข้อมูลรายวิชาที่เผยแพร่ได้ ส่วนสื่อเฉพาะผู้เรียนและคะแนนรายบุคคลจะอยู่หลังการเข้าสู่ระบบ"
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
      <section className="mt-10">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Interactive Learning</p>
            <h2>สื่อฝึกที่เชื่อมกับการเรียนรายวิชา</h2>
          </div>
          <Link className="text-link" to="/teaching">
            ดูสื่อการสอนทั้งหมด
          </Link>
        </div>
        <div className="content-grid mt-6">
          {interactiveLearningResources.map((resource) => (
            <article className="info-panel" key={resource.href}>
              <p className="metadata-label">{resource.subject}</p>
              <h3>{resource.title}</h3>
              <p>{resource.summary}</p>
              <p>{resource.status}</p>
              <a
                className="text-link mt-4 inline-flex"
                href={resource.href}
                rel="noreferrer"
                target="_blank"
              >
                เปิดสื่อ interactive
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
