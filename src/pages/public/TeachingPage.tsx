import { PageShell } from "../../components/PageShell";
import { teachingFocus } from "../../content/publicAcademic";

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
      <div className="mt-6 rounded-lg border border-copper-accent/30 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">
          ขอบเขตของข้อมูลการเรียน
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          หน้า public ใช้เผยแพร่แนวทางรายวิชาและสื่อทั่วไปเท่านั้น ส่วนคะแนน
          feedback และข้อมูล enrollment รายบุคคลต้องอยู่ในพื้นที่รายวิชาหลังเข้าสู่ระบบ
          และอยู่ภายใต้ Firestore Security Rules เสมอ
        </p>
      </div>
    </PageShell>
  );
}
