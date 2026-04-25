import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../features/auth/authContext";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const localTestAccounts = [
  {
    label: "อาจารย์ทดสอบ",
    email: "teacher-admin@example.test",
    password: "local-test-password",
  },
  {
    label: "นักศึกษาทดสอบ",
    email: "6612345678901@student.sru.ac.th",
    password: "local-test-password",
  },
  {
    label: "นักศึกษานอก roster",
    email: "6612345678999@student.sru.ac.th",
    password: "local-test-password",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    clearError,
    error,
    firebaseReady,
    isEmulatorMode,
    signInWithGoogle,
    signInWithTestAccount,
    status,
    user,
  } = useAuth();
  const fromPath =
    (location.state as LocationState | null)?.from?.pathname ?? "/student";
  const isLoading = status === "loading";
  const isSignedIn = status === "authenticated";

  async function handleGoogleSignIn() {
    clearError();
    await signInWithGoogle();
  }

  async function handleTestSignIn(email: string, password: string) {
    clearError();
    await signInWithTestAccount(email, password);
  }

  return (
    <PageShell
      eyebrow="เข้าสู่ระบบ"
      title="Firebase Authentication"
      description="ระบบจะเปิดให้เข้าสู่ระบบด้วย Google เมื่อกำหนดค่า Firebase web app environment variables และเปิด Google provider ใน Firebase Console แล้ว"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="info-panel">
          <h2>สถานะการเข้าสู่ระบบ</h2>
          {isLoading ? (
            <p>กำลังตรวจสอบสถานะ Firebase Authentication...</p>
          ) : isSignedIn ? (
            <>
              <p>
                เข้าสู่ระบบในชื่อ {user?.displayName ?? user?.email ?? "ผู้ใช้ Firebase"}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="button-primary"
                  onClick={() => navigate(fromPath)}
                  type="button"
                >
                  ดำเนินการต่อ
                </button>
                <Link className="button-secondary" to="/">
                  กลับหน้า public
                </Link>
              </div>
            </>
          ) : (
            <>
              <p>
                เข้าสู่ระบบด้วย Google เพื่อใช้พื้นที่รายวิชาของอาจารย์สิทธิโชค
                และแดชบอร์ดอาจารย์ ระบบนี้ไม่ใช่ระบบทะเบียนหรือระบบกลางของมหาวิทยาลัย
                สำหรับสิทธิ์ admin ยังต้องมีเอกสาร `admins/&lbrace;uid&rbrace;`
                ใน Firestore allowlist
              </p>
              <button
                className="button-primary mt-5"
                disabled={!firebaseReady || isLoading || isEmulatorMode}
                onClick={() => void handleGoogleSignIn()}
                type="button"
              >
                เข้าสู่ระบบด้วย Google
              </button>
              {isEmulatorMode ? (
                <div className="mt-5 rounded-md border border-sage-line bg-paper-warm p-4">
                  <h3 className="text-base font-semibold text-ink">
                    Local Emulator QA
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    โหมดนี้ใช้บัญชีปลอมใน Firebase Emulator เท่านั้น
                    เพื่อทดสอบ flow โดยไม่ใช้ Google account จริง
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {localTestAccounts.map((account) => (
                      <button
                        className="button-secondary"
                        disabled={!firebaseReady || isLoading}
                        key={account.email}
                        onClick={() =>
                          void handleTestSignIn(account.email, account.password)
                        }
                        type="button"
                      >
                        {account.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
          {error ? <p className="alert-message mt-5">{error}</p> : null}
          {!firebaseReady ? (
            <p className="alert-message mt-5">
              ยังไม่ได้ตั้งค่า Firebase กรุณา copy `.env.example` เป็น `.env.local`
              และกรอกค่า Firebase web app ให้ครบถ้วน
            </p>
          ) : null}
        </div>
        <div className="info-panel">
          <h2>รายการตรวจสอบการตั้งค่า</h2>
          <ul className="mt-4 space-y-3">
            <li className="check-row">สร้าง Firebase web app</li>
            <li className="check-row">copy `.env.example` เป็น `.env.local`</li>
            <li className="check-row">เปิด Google Sign-In ใน Firebase Console</li>
            <li className="check-row">
              สร้าง `admins/&lbrace;uid&rbrace;` ก่อนใช้งานแดชบอร์ดอาจารย์
            </li>
            <li className="check-row">
              สำหรับ local QA ให้ใช้ `npm run qa:emulators`, `npm run qa:seed`
              และ `npm run dev:emulator`
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
