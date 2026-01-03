'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Calendar, Clock, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { name: 'Time Off', href: '/dashboard/time-off', icon: Clock },
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#1a1c23] text-gray-300 w-64 border-r border-gray-800">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xl font-mono">O</span>
                    </div>
                    <span className="text-white font-semibold text-lg">OdooXGcet</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-purple-600/10 text-purple-400 font-medium"
                                        : "hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-purple-400" : "text-gray-400 group-hover:text-white"
                                )} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-800">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>
            </div>
        </div>
    );
}
