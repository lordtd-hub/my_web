import { PageShell } from "../../components/PageShell";
import {
  interactiveLearningResources,
  teachingFocus,
} from "../../content/publicAcademic";

export function TeachingPage() {
  return (
    <PageShell
      eyebrow="สื่อการสอน"
      title="แนวทางการสอนและสื่อประกอบ"
      description="พื้นที่นี้อธิบายแนวทางการจัดการเรียนรู้และสื่อประกอบรายวิชา ไม่ใช้สำหรับแสดงผลงานวิจัยหรือคะแนนรายบุคคล"
    >
      <div className="content-grid">
        {teachingFocus.map((item) => (
          <article className="info-panel" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
          ))}
      </div>
      <section className="mt-10">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Interactive Learning</p>
            <h2>สื่อฝึกแบบโต้ตอบ</h2>
          </div>
        </div>
        <div className="content-grid mt-6">
          {interactiveLearningResources.map((resource) => (
            <article className="detail-tile" key={resource.href}>
              <span>{resource.subject}</span>
              <strong>{resource.title}</strong>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                {resource.summary}
              </p>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                {resource.status}
              </p>
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
      <div className="mt-6 rounded-lg border border-copper-accent/30 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">
          ขอบเขตของข้อมูลการเรียน
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          หน้าเว็บสาธารณะใช้เผยแพร่แนวทางรายวิชาและสื่อทั่วไปเท่านั้น ส่วนคะแนน
          feedback และข้อมูลรายบุคคลของผู้เรียนต้องอยู่ในพื้นที่รายวิชาหลังเข้าสู่ระบบเสมอ
        </p>
      </div>
    </PageShell>
  );
}
