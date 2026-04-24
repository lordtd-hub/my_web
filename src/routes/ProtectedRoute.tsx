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
        description="ระบบนักศึกษาและแดชบอร์ดอาจารย์จะใช้งานได้เมื่อ `.env.local` มีค่า Firebase web app และเปิด Google Sign-In ใน Firebase Console แล้ว"
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
        description="กรุณารอสักครู่ ระบบกำลังตรวจสอบสถานะ Firebase Authentication"
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
        title="กำลังตรวจสอบสิทธิ์ admin"
        description="กรุณารอสักครู่ Firestore กำลังตรวจสอบ `admins/{uid}` allowlist"
      />
    );
  }

  if (adminStatus !== "allowed") {
    return (
      <PageShell
        eyebrow="แดชบอร์ดอาจารย์"
        title="ยังไม่มีสิทธิ์เข้าแดชบอร์ดอาจารย์"
        description="แดชบอร์ดนี้ต้องมีเอกสาร `admins/{uid}` ใน Firestore สำหรับผู้ใช้ที่เข้าสู่ระบบ"
      >
        {error ? <p className="alert-message">{error}</p> : null}
        <Link className="button-secondary mt-6" to="/">
          กลับหน้า public
        </Link>
      </PageShell>
    );
  }

  return children;
}
