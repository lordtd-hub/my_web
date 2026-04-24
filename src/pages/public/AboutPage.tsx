import { PageShell } from "../../components/PageShell";
import { profilePlaceholder } from "../../content/publicAcademic";

export function AboutPage() {
  return (
    <PageShell
      eyebrow="ประวัติ"
      title="ประวัติทางวิชาการ"
      description="หน้านี้จัดเตรียมไว้สำหรับแนะนำภูมิหลังทางวิชาการ แนวทางการสอน และข้อมูลวิชาชีพของอาจารย์ เมื่อได้รับข้อมูลที่ตรวจสอบแล้ว"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            P
          </div>
          <dl className="mt-6 space-y-4">
            <div>
              <dt>ชื่ออาจารย์</dt>
              <dd>{profilePlaceholder.displayName}</dd>
            </div>
            <div>
              <dt>ตำแหน่ง</dt>
              <dd>{profilePlaceholder.position}</dd>
            </div>
            <div>
              <dt>มหาวิทยาลัย</dt>
              <dd>{profilePlaceholder.university}</dd>
            </div>
          </dl>
        </aside>
        <div className="info-panel">
          <h2>ภาพรวมประวัติ</h2>
          <p>{profilePlaceholder.bio}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="detail-tile">
              <span>ภาควิชา</span>
              <strong>{profilePlaceholder.department}</strong>
            </div>
            <div className="detail-tile">
              <span>รูปประจำตัวสำหรับเผยแพร่</span>
              <strong>รอข้อมูลยืนยัน</strong>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
