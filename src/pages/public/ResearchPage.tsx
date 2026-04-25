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
      description="หัวข้อวิจัยหลักครอบคลุม fixed point theory, uniform spaces, generalized contractions และ graph theory บางแขนง"
    >
      <div className="content-grid">
        {profilePlaceholder.researchInterests.map((interest) => (
          <article className="info-panel" key={interest.title}>
            <h2>{interest.title}</h2>
            <p>{interest.summary}</p>
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
              {publication.url ? (
                <a
                  className="text-link mt-3 inline-flex"
                  href={publication.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  อ่านรายละเอียด
                </a>
              ) : null}
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
