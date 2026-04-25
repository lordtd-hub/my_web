import { PageShell } from "../../components/PageShell";
import { publicProjects } from "../../content/publicAcademic";

export function ProjectsPage() {
  return (
    <PageShell
      eyebrow="กิจกรรม"
      title="กิจกรรมและสื่อสนับสนุนการเรียนรู้"
      description="พื้นที่นี้รวมกิจกรรม สื่อ หรือเครื่องมือประกอบการเรียนรู้ที่เผยแพร่ได้ ส่วนผลงานวิจัยจะแยกไว้ในหน้างานวิจัยโดยเฉพาะ"
    >
      <div className="content-grid">
        {publicProjects.map((project) => (
          <article className="info-panel" key={project.title}>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
