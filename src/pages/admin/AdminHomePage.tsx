import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { AdminLayout } from "./AdminLayout";

export function AdminHomePage() {
  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="จัดการรายวิชาและคะแนน"
      description="สิทธิ์เข้าใช้งานส่วนนี้ถูกควบคุมด้วย Firestore allowlist ที่ `admins/{uid}`"
    >
      <AdminLayout>
        <div className="content-grid">
          <article className="info-panel">
            <h2>จัดการรายวิชา</h2>
            <p>สร้างและตรวจสอบ course records ใน Firestore</p>
            <Link className="button-secondary mt-5" to="/admin/courses">
              จัดการรายวิชา
            </Link>
          </article>
          <article className="info-panel">
            <h2>Import คะแนนจาก CSV</h2>
            <p>
              ตรวจสอบและ import คะแนนใน browser หลังจาก match แถว CSV
              กับนักศึกษาที่ลงทะเบียนแล้ว
            </p>
            <Link className="button-primary mt-5" to="/admin/courses">
              เลือกรายวิชา
            </Link>
          </article>
        </div>
      </AdminLayout>
    </PageShell>
  );
}
