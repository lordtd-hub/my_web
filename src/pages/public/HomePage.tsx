import { Link } from "react-router-dom";
import {
  profilePlaceholder,
  publications,
  publicCourses,
} from "../../content/publicAcademic";

const highlights = [
  {
    title: "งานวิจัย",
    body: "เผยแพร่ผลงานด้านคณิตศาสตร์บริสุทธิ์ โดยเน้นทฤษฎีจุดตรึงและเริ่มขยายความสนใจไปยัง graph theory บางแขนง",
    link: "/research",
    linkLabel: "ดูผลงานวิจัย",
    tone: "blue",
  },
  {
    title: "การเรียนการสอน",
    body: "จัดวางรายวิชา สื่อประกอบ และกิจกรรมการเรียนรู้ให้แยกจากข้อมูลคะแนนรายบุคคลอย่างชัดเจน",
    link: "/teaching",
    linkLabel: "ดูแนวทางการสอน",
    tone: "copper",
  },
  {
    title: "รายวิชาของฉัน",
    body: "พื้นที่ส่วนตัวสำหรับผู้เรียนในรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอน ใช้ดูข้อมูลรายวิชาและคะแนนที่เผยแพร่แล้ว",
    link: "/student",
    linkLabel: "เข้าสู่รายวิชา",
    tone: "sage",
  },
];

export function HomePage() {
  return (
    <>
      <section className="hero-section mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:min-h-[610px] lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-8 lg:py-16">
        <div className="hero-copy">
          <p className="section-eyebrow">Mathematics Lecturer</p>
          <h1>
            <span>{profilePlaceholder.displayName}</span>
            <small>{profilePlaceholder.displayNameEn}</small>
          </h1>
          <span className="hero-rule" aria-hidden="true" />
          <p className="hero-subtitle">
            คณิตศาสตร์ • Fixed point theory • Graph theory
          </p>
          <p className="hero-body">
            อาจารย์ประจำสาขาวิชาคณิตศาสตร์ มุ่งเน้นงานวิจัยทางคณิตศาสตร์บริสุทธิ์
            โดยเฉพาะทฤษฎีจุดตรึง ปริภูมิเอกรูป และ generalized contractions
            พร้อมขยายความสนใจไปยัง graph theory ด้าน distinct length path decomposition
            เพื่อสร้างรากฐานที่แข็งแรงให้กับนักศึกษา
          </p>
          <div className="hero-actions">
            <Link className="button-primary" to="/courses">
              <span aria-hidden="true">▱</span>
              ดูรายวิชา
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="button-secondary" to="/research">
              <span aria-hidden="true">⌁</span>
              งานวิจัย
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className="concept-hero-visual" aria-label="ภาพรวมระบบวิชาการ">
          <div className="math-board-wrap">
            <img
              alt="ภาพประกอบกราฟและสูตร fixed point theory"
              className="math-board-image"
              src="/math-orbit-board.svg"
            />
          </div>
          <div className="float-card float-card-research">
            <div className="float-icon" aria-hidden="true">▤</div>
            <div>
              <p>งานวิจัยเด่น</p>
              <ul>
                {publications.map((publication) => (
                  <li key={publication.title}>{publication.title}</li>
                ))}
              </ul>
              <Link to="/research">ดูทั้งหมด →</Link>
            </div>
          </div>
          <div className="float-card float-card-course">
            <div className="float-icon green" aria-hidden="true">▰</div>
            <div>
              <p>รายวิชาสาธารณะ</p>
              <ul>
                {publicCourses.map((course) => (
                  <li key={course.slug}>{course.title}</li>
                ))}
              </ul>
              <Link to="/courses">ดูรายวิชา →</Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-focus-section">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="focus-heading">
            <p>Research · Teaching · Course Portal</p>
            <h2>งานวิจัย การสอน และพื้นที่ผู้เรียนในรายวิชา</h2>
          </div>
          <div className="focus-card-grid">
            {highlights.map((highlight) => (
              <article
                className={`focus-card ${highlight.tone}`}
                key={highlight.title}
              >
                <div className="focus-icon" aria-hidden="true">
                  {highlight.tone === "blue"
                    ? "⌕"
                    : highlight.tone === "copper"
                      ? "▱"
                      : "▵"}
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.body}</p>
                <Link to={highlight.link}>{highlight.linkLabel} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-band">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">งานวิจัย</p>
              <h2>ผลงานเผยแพร่ที่คัดไว้</h2>
            </div>
            <Link className="text-link" to="/research">
              งานวิจัยทั้งหมด
            </Link>
          </div>
          <div className="content-grid mt-8">
            {publications.map((publication) => (
              <article className="info-panel" key={publication.title}>
                <p className="metadata-label">{publication.year}</p>
                <h3>{publication.title}</h3>
                <p>{publication.venue}</p>
                {publication.url ? (
                  <a className="text-link mt-4 inline-flex" href={publication.url} rel="noreferrer" target="_blank">
                    อ่านรายละเอียด
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">รายวิชา</p>
            <h2>ข้อมูลรายวิชาที่เผยแพร่ได้</h2>
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
