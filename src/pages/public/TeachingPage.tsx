import { PageShell } from "../../components/PageShell";
import { teachingFocus } from "../../content/publicAcademic";

export function TeachingPage() {
  return (
    <PageShell
      eyebrow="การสอน"
      title="แนวทางการสอน"
      description="หน้านี้จัดเตรียมไว้สำหรับอธิบายแนวทางการสอน รายวิชาปัจจุบัน คำแนะนำในการเรียน และความคาดหวังของรายวิชา เมื่อได้รับข้อมูลจริงแล้ว"
    >
      <div className="content-grid">
        {teachingFocus.map((item) => (
          <article className="info-panel" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-copper-accent/30 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">ความเป็นส่วนตัวของการประเมินผล</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          หน้า public สามารถอธิบายแนวทางการประเมินได้ในอนาคต แต่คะแนนรายบุคคลของนักศึกษา
          ต้องคงเป็นข้อมูลส่วนตัวและอยู่ภายใต้ Firestore Security Rules เสมอ
        </p>
      </div>
    </PageShell>
  );
}
