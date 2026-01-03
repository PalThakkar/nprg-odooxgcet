"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Calendar,
  Clock,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
  { name: "Time Off", href: "/dashboard/time-off", icon: Clock },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div
      className="flex flex-col h-full w-64 border-r"
      style={{
        backgroundColor: "var(--color-slate-950)",
        color: "var(--color-slate-300)",
        borderColor: "var(--color-slate-800)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--color-teal-600), var(--color-emerald-600))",
            }}
          >
            <span
              className="font-bold text-xl font-mono"
              style={{ color: "var(--color-white)" }}
            >
              O
            </span>
          </div>
          <span
            className="font-semibold text-lg"
            style={{ color: "var(--color-white)" }}
          >
            OdooXGcet
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group"
                style={
                  isActive
                    ? {
                        backgroundColor:
                          "color-mix(in srgb, var(--color-teal-500) 10%, transparent)",
                        color: "var(--color-teal-400)",
                        fontWeight: "500",
                      }
                    : {}
                }
              >
                <item.icon
                  className="w-5 h-5"
                  style={{
                    color: isActive
                      ? "var(--color-teal-400)"
                      : "var(--color-slate-400)",
                  }}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--color-teal-400)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className="mt-auto p-6 border-t"
        style={{ borderColor: "var(--color-slate-800)" }}
      >
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          style={{ color: "var(--color-slate-300)" }}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
