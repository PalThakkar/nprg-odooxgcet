"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/employees" },
    { label: "Attendance", href: "/employees/attendance" },
    { label: "Time Off", href: "/employees/time-off" },
    ...(user?.role?.toLowerCase() === "admin"
      ? [
        { label: "Employees", href: "/admin/employees" },
        { label: "Leave Approval", href: "/admin/leaves" },
      ]
      : []),
  ];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-slate-950 font-mono"
    >
      {/* Sidebar */}
      <aside
        className="w-full md:w-64 p-6 md:sticky md:top-0 md:h-screen flex flex-col z-20"
        style={{
          borderRight: "2px solid var(--color-slate-800)",
        }}
      >
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div
            className="h-10 w-10 flex items-center justify-center font-black text-xl shrink-0 border-2 border-primary bg-slate-900 shadow-[4px_4px_0px_0px_var(--color-primary)]"
            style={{
              color: "var(--color-primary)",
            }}
          >
            O
          </div>
          <span
            className="text-xl font-black tracking-tighter truncate uppercase"
            style={{ color: "var(--color-white)" }}
          >
            Odoo India
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm font-bold uppercase transition-all group border-2 border-transparent hover:border-primary hover:bg-slate-900 hover:shadow-[4px_4px_0px_0px_var(--color-primary)] hover:-translate-y-1"
              style={{ color: "var(--color-slate-300)" }}
            >
              <span className="group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div
          className="mt-auto pt-6"
          style={{ borderTop: "2px solid var(--color-slate-800)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 flex items-center justify-center text-xs font-bold uppercase border-2 border-slate-700 bg-slate-800"
              style={{
                color: "var(--color-slate-300)",
              }}
            >
              {user?.role?.substring(0, 1).toUpperCase() || "E"}
            </div>
            <div className="overflow-hidden">
              <p
                className="text-xs font-bold truncate uppercase tracking-wide"
                style={{ color: "var(--color-slate-300)" }}
              >
                {user?.name || "Employee"}
              </p>
              <p
                className="text-[10px] truncate font-mono"
                style={{ color: "var(--color-slate-500)" }}
              >
                {user?.role?.toLowerCase() === "admin" ? "ADMINISTRATOR" : user?.employeeId || "USER-001"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 relative">
        {/* Abstract Grid Background for Dashboard */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--color-slate-800) 1px, transparent 1px), linear-gradient(90deg, var(--color-slate-800) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <header
          className="h-16 px-8 flex items-center justify-between sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm"
          style={{
            borderBottom: "2px solid var(--color-slate-800)",
          }}
        >
          <div className="md:hidden">
            <span className="font-black uppercase" style={{ color: "var(--color-white)" }}>
              Odoo India
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <LogoutButton />
          </div>
        </header>
        <div className="p-0 relative z-10">{children}</div>
      </main>
    </div>
  );
}
