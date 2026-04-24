import { PageShell } from "../../components/PageShell";
import { publicProjects } from "../../content/publicAcademic";

export function ProjectsPage() {
  return (
    <PageShell
      eyebrow="โครงการ"
      title="โครงการและสื่อวิชาการ"
      description="พื้นที่สำหรับสรุปโครงการวิชาการ สื่อการสอน หรือเครื่องมือประกอบการเรียนรู้ที่ได้รับอนุญาตให้เผยแพร่"
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
