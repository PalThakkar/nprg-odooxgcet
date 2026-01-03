import { headers } from 'next/headers';
import Link from 'next/link';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();
    const userRole = headerList.get('x-user-role');
    const loginId = headerList.get('x-user-login-id');

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        ...(userRole === 'admin' ? [
            { label: 'Employees', href: '/dashboard/admin/employees' },
            { label: 'Leave Approval', href: '/dashboard/admin/leaves' },
        ] : []),
    ];

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-900 text-white p-6 md:sticky md:top-0 md:h-screen flex flex-col">
                <div className="flex items-center gap-3 mb-10 overflow-hidden">
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20 shrink-0">O</div>
                    <span className="text-xl font-black tracking-tight truncate">Odoo India</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase">
                            {userRole?.substring(0, 1)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">Admin User</p>
                            <p className="text-[10px] text-zinc-500 truncate">{loginId || 'USER-001'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="md:hidden">
                        <span className="font-bold">Odoo India</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Logout</button>
                    </div>
                </header>
                <div className="p-0 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
