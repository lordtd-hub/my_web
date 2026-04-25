import { PageShell } from "../../components/PageShell";
import {
  academicLinks,
  profilePlaceholder,
  publications,
} from "../../content/publicAcademic";

export function ResearchPage() {
  return (
    <PageShell
      eyebrow="วิจัย"
      title="ความสนใจด้านวิจัย"
      description="หัวข้อวิจัยหลักอยู่ในกลุ่ม fixed point theory, uniform spaces และ generalized contractions"
    >
      <div className="content-grid">
        {profilePlaceholder.researchInterests.map((interest) => (
          <article className="info-panel" key={interest}>
            <h2>{interest}</h2>
            <p>
              หัวข้อวิจัยด้านคณิตศาสตร์ที่เกี่ยวข้องกับโครงสร้างของปริภูมิและเงื่อนไขของการมีจุดตรึง
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 info-panel">
        <h2>ผลงานเผยแพร่ที่คัดไว้</h2>
        <div className="mt-5 grid gap-4">
          {publications.map((publication) => (
            <article
              className="rounded-md border border-sage-line/70 bg-paper-warm p-4"
              key={publication.title}
            >
              <h3 className="text-lg font-semibold text-ink">
                {publication.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                {publication.authors}
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/65">
                {publication.venue}, {publication.year}
              </p>
              <a
                className="text-link mt-3 inline-flex"
                href={publication.url}
                rel="noreferrer"
                target="_blank"
              >
                อ่านรายละเอียด
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-6 info-panel">
        <h2>ลิงก์โปรไฟล์วิชาการ</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {academicLinks.map((link) => (
            <a
              className="external-link-card"
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target="_blank"
            >
              <span>{link.label}</span>
              <small>{link.note}</small>
            </a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
