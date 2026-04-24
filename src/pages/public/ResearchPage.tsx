import { PageShell } from "../../components/PageShell";
import { profilePlaceholder } from "../../content/publicAcademic";

export function ResearchPage() {
  return (
    <PageShell
      eyebrow="วิจัย"
      title="ความสนใจด้านวิจัย"
      description="หน้านี้จะนำเสนอหัวข้อวิจัย ผลงานเผยแพร่ และลิงก์ทางวิชาการ เมื่อได้รับข้อมูลที่ตรวจสอบแล้ว"
    >
      <div className="content-grid">
        {profilePlaceholder.researchInterests.map((interest) => (
          <article className="info-panel" key={interest}>
            <h2>{interest}</h2>
            <p>
              พื้นที่สำหรับคำอธิบายงานวิจัยที่สามารถเผยแพร่ได้ ควรใช้เฉพาะข้อมูลที่ตรวจสอบแล้วเท่านั้น
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 info-panel">
        <h2>ลิงก์โปรไฟล์วิชาการ</h2>
        <p>
          Google Scholar, ORCID, GitHub และลิงก์โปรไฟล์อื่น ๆ
          ยังรอการยืนยัน จึงยังไม่ใส่ข้อมูลจริงในระบบ
        </p>
      </div>
    </PageShell>
  );
}
