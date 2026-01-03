import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const userRole = headerList.get("x-user-role");
  const loginId = headerList.get("x-user-login-id");

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    ...(userRole === "admin"
      ? [
          { label: "Employees", href: "/dashboard/admin/employees" },
          { label: "Leave Approval", href: "/dashboard/admin/leaves" },
        ]
      : []),
  ];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        background: `linear-gradient(to bottom right, var(--color-slate-950), var(--color-slate-900), var(--color-slate-950))`,
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-full md:w-64 p-6 md:sticky md:top-0 md:h-screen flex flex-col"
        style={{
          backgroundColor: "var(--color-slate-950)",
          borderRight: "1px solid var(--color-slate-800)",
        }}
      >
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xl shrink-0"
            style={{
              background: `linear-gradient(to bottom right, color-mix(in srgb, var(--color-teal-500) 30%, transparent), color-mix(in srgb, var(--color-emerald-500) 30%, transparent))`,
              color: "var(--color-teal-500)",
            }}
          >
            O
          </div>
          <span
            className="text-xl font-black tracking-tight truncate"
            style={{ color: "var(--color-white)" }}
          >
            Odoo India
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors group"
              style={{ color: "var(--color-slate-300)" }}
            >
              <span className="group-hover:translate-x-1 transition-transform">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div
          className="mt-auto pt-6"
          style={{ borderTop: "1px solid var(--color-slate-800)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold uppercase"
              style={{
                background: `color-mix(in srgb, var(--color-teal-500) 15%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--color-teal-500) 30%, transparent)`,
                color: "var(--color-teal-500)",
              }}
            >
              {userRole?.substring(0, 1)}
            </div>
            <div className="overflow-hidden">
              <p
                className="text-xs font-bold truncate"
                style={{ color: "var(--color-slate-300)" }}
              >
                Admin User
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--color-slate-500)" }}
              >
                {loginId || "USER-001"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header
          className="h-16 px-8 flex items-center justify-between sticky top-0 z-10"
          style={{
            backgroundColor: `color-mix(in srgb, var(--color-slate-950) 50%, transparent)`,
            borderBottom: "1px solid var(--color-slate-800)",
          }}
        >
          <div className="md:hidden">
            <span className="font-bold" style={{ color: "var(--color-white)" }}>
              Odoo India
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--color-slate-400)" }}
            >
              Logout
            </button>
          </div>
        </header>
        <div className="p-0">{children}</div>
      </main>
    </div>
  );
}
