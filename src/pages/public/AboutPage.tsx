import { PageShell } from "../../components/PageShell";
import { profilePlaceholder } from "../../content/publicAcademic";

export function AboutPage() {
  return (
    <PageShell
      eyebrow="ประวัติ"
      title="ประวัติทางวิชาการ"
      description="ข้อมูลสาธารณะสำหรับแนะนำภูมิหลังทางวิชาการ สังกัด และทิศทางงานวิจัยของอาจารย์"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="profile-card">
          <img
            alt="สัญลักษณ์โปรไฟล์คณิตศาสตร์ของ ดร.สิทธิโชค ทรงสอาด"
            className="profile-avatar-image"
            src={profilePlaceholder.profileImage}
          />
          <dl className="mt-6 space-y-4">
            <div>
              <dt>ชื่ออาจารย์</dt>
              <dd>{profilePlaceholder.displayName}</dd>
            </div>
            <div>
              <dt>ชื่อภาษาอังกฤษ</dt>
              <dd>{profilePlaceholder.displayNameEn}</dd>
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
              <span>สังกัด</span>
              <strong>{profilePlaceholder.department}</strong>
            </div>
            <div className="detail-tile">
              <span>ห้องทำงาน</span>
              <strong>{profilePlaceholder.office}</strong>
            </div>
            <div className="detail-tile">
              <span>รูปประจำตัวสำหรับเผยแพร่</span>
              <strong>ใช้รูปถ่ายที่อาจารย์ให้มาสำหรับหน้า public profile</strong>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
