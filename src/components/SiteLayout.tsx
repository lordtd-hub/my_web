import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";

const publicLinks = [
  { to: "/", label: "หน้าแรก" },
  { to: "/about", label: "ประวัติ" },
  { to: "/teaching", label: "การสอน" },
  { to: "/courses", label: "รายวิชา" },
  { to: "/research", label: "วิจัย" },
  { to: "/projects", label: "โครงการ" },
  { to: "/contact", label: "ติดต่อ" },
];

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const { logout, status, user } = useAuth();
  const isSignedIn = status === "authenticated";

  return (
    <div className="min-h-screen bg-paper-warm text-ink">
      <header className="border-b border-ink/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/" className="group max-w-sm">
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-academic-blue">
                Academic Learning Portal
              </span>
              <span className="mt-1 block text-xl font-semibold text-ink group-hover:text-academic-blue">
                พื้นที่วิชาการและรายวิชาคณิตศาสตร์
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
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
                ระบบนักศึกษา
              </Link>
            </div>
          </div>
          <nav aria-label="เมนูหลัก" className="flex flex-wrap gap-2">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-academic-blue text-white"
                      : "text-ink/70 hover:bg-white hover:text-academic-blue",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="min-h-[62vh]">{children}</main>
      <footer className="border-t border-ink/10 bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-line">
              ข้อมูลอยู่ระหว่างจัดเตรียม
            </p>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              ข้อมูลประวัติทางวิชาการ ช่องทางติดต่อ และสังกัดสถาบัน
              จะเผยแพร่เมื่อได้รับข้อมูลที่ยืนยันแล้วเท่านั้น
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
