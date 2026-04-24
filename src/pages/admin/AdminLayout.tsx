import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "ภาพรวม" },
  { to: "/admin/courses", label: "รายวิชา" },
  { to: "/admin/courses/new", label: "สร้างรายวิชา" },
];

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="admin-sidebar">
        <p className="metadata-label">แดชบอร์ดอาจารย์</p>
        <nav aria-label="เมนูแดชบอร์ดอาจารย์" className="mt-4 grid gap-2">
          {adminLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-academic-blue text-white"
                    : "text-ink/70 hover:bg-paper-warm hover:text-academic-blue",
                ].join(" ")
              }
              end={link.to === "/admin"}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
