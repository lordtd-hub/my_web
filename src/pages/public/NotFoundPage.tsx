import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";

export function NotFoundPage() {
  return (
    <PageShell
      eyebrow="ไม่พบหน้า"
      title="ไม่พบหน้าที่ร้องขอ"
      description="กรุณาใช้เมนูหลักเพื่อกลับไปยังหน้าที่มีอยู่ในระบบ"
    >
      <Link className="button-primary" to="/">
        กลับหน้าแรก
      </Link>
    </PageShell>
  );
}
