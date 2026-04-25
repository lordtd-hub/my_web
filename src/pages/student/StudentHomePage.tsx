import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../features/auth/authContext";

export function StudentHomePage() {
  const { user } = useAuth();

  return (
    <PageShell
      eyebrow="รายวิชาของฉัน"
      title="พื้นที่ผู้เรียนในรายวิชาของอาจารย์สิทธิโชค"
      description="เข้าถึงรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอนและข้อมูลคะแนนส่วนตัวหลังเข้าสู่ระบบ"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            S
          </div>
          <dl className="mt-6 space-y-4">
            <div>
              <dt>เข้าสู่ระบบในชื่อ</dt>
              <dd>{user?.displayName ?? user?.email ?? "ผู้ใช้ Firebase"}</dd>
            </div>
            <div>
              <dt>รูปแบบการระบุตัวตน</dt>
              <dd>Firebase Auth UID</dd>
            </div>
          </dl>
        </aside>

        <div className="info-panel border-copper-accent/30">
          <h2>พื้นที่การเรียนรู้ส่วนบุคคล</h2>
          <p>
            ระบบอ่านข้อมูลรายวิชาจาก enrollment documents ใน Firestore
            ที่ผูกกับบัญชีของท่านสำหรับรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอน
            หน้าคะแนนจะใช้ Firebase Auth UID ของท่านในการอ่าน score document เสมอ
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" to="/student/courses">
              ดูรายวิชาของฉัน
            </Link>
            <Link className="button-secondary" to="/">
              กลับหน้า public
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
