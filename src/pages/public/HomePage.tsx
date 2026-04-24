import { Link } from "react-router-dom";
import {
  profilePlaceholder,
  publicCourses,
  teachingFocus,
} from "../../content/publicAcademic";

const highlights = [
  "ประวัติทางวิชาการ",
  "หน้ารายวิชาสำหรับการเรียนรู้",
  "ระบบนักศึกษาที่คุ้มครองข้อมูลส่วนตัว",
];

export function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="section-eyebrow">Mathematics Learning Portal</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {profilePlaceholder.displayName}
          </h1>
          <p className="mt-4 text-xl font-medium text-academic-blue">
            {profilePlaceholder.position} · {profilePlaceholder.university}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
            เว็บไซต์เชิงวิชาการสำหรับนำเสนอประวัติ การสอน งานวิจัย และรายวิชาคณิตศาสตร์
            โดยแยกข้อมูลส่วนตัวของนักศึกษาและคะแนนออกจากพื้นที่สาธารณะอย่างชัดเจน
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary" to="/courses">
              ดูรายวิชา
            </Link>
            <Link className="button-secondary" to="/about">
              ประวัติอาจารย์
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="academic-mark" aria-hidden="true">
            ∫
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-copper-accent">
            ภาพรวมเว็บไซต์
          </p>
          <div className="mt-6 grid gap-4">
            {highlights.map((highlight) => (
              <div
                className="rounded-md border border-sage-line/60 bg-paper-warm p-4"
                key={highlight}
              >
                <p className="font-semibold text-ink">{highlight}</p>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  เตรียมพื้นที่สำหรับข้อมูลที่ตรวจสอบแล้ว โดยไม่ใส่ข้อมูลจริงแทนผู้ใช้
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="section-band">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">แนวทางการสอน</p>
              <h2>สนับสนุนการเรียนรู้คณิตศาสตร์อย่างเป็นระบบ</h2>
            </div>
            <Link className="text-link" to="/teaching">
              อ่านแนวทางการสอน
            </Link>
          </div>
          <div className="content-grid mt-8">
            {teachingFocus.map((item) => (
              <article className="info-panel" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">รายวิชา</p>
            <h2>รายวิชาที่จัดเตรียมไว้สำหรับเผยแพร่</h2>
          </div>
          <Link className="text-link" to="/courses">
            รายวิชาทั้งหมด
          </Link>
        </div>
        <div className="content-grid mt-8">
          {publicCourses.map((course) => (
            <article className="info-panel" key={course.slug}>
              <p className="metadata-label">{course.code}</p>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <Link className="text-link mt-4 inline-flex" to={`/courses/${course.slug}`}>
                ดูภาพรวมรายวิชา
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
