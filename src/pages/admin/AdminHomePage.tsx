import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { AdminLayout } from "./AdminLayout";

export function AdminHomePage() {
  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="จัดการรายวิชาและคะแนน"
      description="ส่วนนี้สำหรับอาจารย์ที่ได้รับสิทธิ์จัดการรายวิชา รายชื่อนักศึกษา และคะแนน"
    >
      <AdminLayout>
        <div className="content-grid">
          <article className="info-panel">
            <h2>จัดการรายวิชา</h2>
            <p>สร้างรายวิชา ตรวจสอบข้อมูลรายวิชา และเตรียมพื้นที่สำหรับผู้เรียน</p>
            <Link className="button-secondary mt-5" to="/admin/courses">
              จัดการรายวิชา
            </Link>
          </article>
          <article className="info-panel">
            <h2>นำเข้าคะแนนจาก CSV</h2>
            <p>
              ตรวจสอบไฟล์คะแนน ดูตัวอย่างก่อนนำเข้า และบันทึกเฉพาะนักศึกษาที่อยู่ในรายวิชา
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
