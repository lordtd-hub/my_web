import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { useAdminStatus } from "../features/admin/useAdminStatus";
import { useAuth } from "../features/auth/authContext";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { firebaseReady, status } = useAuth();
  const { adminStatus, error } = useAdminStatus();

  if (!firebaseReady) {
    return (
      <PageShell
        eyebrow="ต้องตั้งค่าระบบ"
        title="ยังไม่ได้ตั้งค่า Firebase"
        description="ระบบเข้าสู่ระบบและพื้นที่รายวิชาจะใช้งานได้หลังตั้งค่า Firebase ของโปรเจกต์นี้เรียบร้อยแล้ว"
      >
        <Link className="button-primary" to="/login">
          ไปที่หน้าตั้งค่าการเข้าสู่ระบบ
        </Link>
      </PageShell>
    );
  }

  if (status === "loading") {
    return (
      <PageShell
        eyebrow="กำลังโหลด"
        title="กำลังตรวจสอบสถานะการเข้าสู่ระบบ"
        description="กรุณารอสักครู่ ระบบกำลังตรวจสอบว่าท่านเข้าสู่ระบบอยู่หรือไม่"
      />
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAdmin) {
    return children;
  }

  if (adminStatus === "checking" || adminStatus === "idle") {
    return (
      <PageShell
        eyebrow="แดชบอร์ดอาจารย์"
        title="กำลังตรวจสอบสิทธิ์เข้าใช้งาน"
        description="กรุณารอสักครู่ ระบบกำลังตรวจสอบว่าบัญชีนี้ได้รับสิทธิ์อาจารย์หรือไม่"
      />
    );
  }

  if (adminStatus !== "allowed") {
    return (
      <PageShell
        eyebrow="แดชบอร์ดอาจารย์"
        title="ยังไม่มีสิทธิ์เข้าแดชบอร์ดอาจารย์"
        description="บัญชีที่เข้าสู่ระบบอยู่ยังไม่ได้รับสิทธิ์อาจารย์ในระบบนี้ หากควรมีสิทธิ์ กรุณาเพิ่มบัญชีนี้ในรายชื่อผู้ดูแลก่อน"
      >
        {error ? <p className="alert-message">{error}</p> : null}
        <Link className="button-secondary mt-6" to="/">
          กลับหน้าแรก
        </Link>
      </PageShell>
    );
  }

  return children;
}
