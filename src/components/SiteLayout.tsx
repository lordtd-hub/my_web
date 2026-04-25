import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";

const publicLinks = [
  { to: "/", label: "หน้าแรก" },
  { to: "/about", label: "เกี่ยวกับ" },
  { to: "/research", label: "งานวิจัย" },
  { to: "/courses", label: "รายวิชา" },
  { to: "/teaching", label: "สื่อการสอน" },
  { to: "/projects", label: "กิจกรรม" },
  { to: "/contact", label: "ติดต่อ" },
];

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const { logout, status, user } = useAuth();
  const isSignedIn = status === "authenticated";

  return (
    <div className="site-shell min-h-screen text-ink">
      <header className="site-header">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(260px,1fr)_auto_minmax(260px,1fr)] lg:items-center lg:px-8">
            <Link to="/" className="group max-w-sm">
              <span className="brand-lockup">
                <span className="brand-mark" aria-hidden="true">
                  <svg viewBox="0 0 48 48" role="presentation">
                    <path d="M24 4 42 14v20L24 44 6 34V14L24 4Z" />
                    <path d="M24 4v40M6 14l18 10 18-10M6 34l18-10 18 10M15 9v30M33 9v30" />
                  </svg>
                </span>
                <span>
                  <span className="block text-lg font-semibold leading-tight text-academic-blue">
                    ดร.สิทธิโชค ทรงสอาด
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.24em] text-ink/60">
                    Sittichoke Songsa-ard
                  </span>
                </span>
              </span>
            </Link>
          <nav aria-label="เมนูหลัก" className="site-nav">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "site-nav-link",
                    isActive ? "is-active" : "",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {isSignedIn ? (
                <>
                  <span className="status-pill">
                    {user?.displayName ?? user?.email ?? "เข้าสู่ระบบแล้ว"}
                  </span>
                  <button className="button-secondary" onClick={() => void logout()} type="button">
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <Link className="button-secondary" to="/login">
                  เข้าสู่ระบบ
                </Link>
              )}
              <Link className="button-primary" to="/student">
                รายวิชาของฉัน
              </Link>
            </div>
        </div>
      </header>
      <main className="min-h-[62vh]">{children}</main>
      <footer className="site-footer">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-line">
              Mathematics Learning Portal
            </p>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              พื้นที่สาธารณะสำหรับข้อมูลวิชาการ และพื้นที่ส่วนตัวสำหรับผู้เรียนในรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอน
            </p>
          </div>
          <Link className="button-on-dark self-start" to="/admin">
            แดชบอร์ดอาจารย์
          </Link>
        </div>
      </footer>
    </div>
  );
}
