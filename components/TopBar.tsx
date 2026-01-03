"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopBar({
  userName,
  userRole,
}: {
  userName?: string;
  userRole?: string;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header
      className="h-16 border-b flex items-center justify-between px-8 sticky top-0 z-30"
      style={{
        borderColor: "var(--color-slate-800)",
        backgroundColor: "var(--color-slate-900)",
      }}
    >
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--color-slate-400)" }}
          />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 transition-all text-sm"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-slate-800) 50%, transparent)",
              borderColor: "var(--color-slate-700)",
              border: "1px solid",
              color: "var(--color-white)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          className="relative transition-colors"
          style={{ color: "var(--color-slate-400)" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2"
            style={{ borderColor: "var(--color-slate-900)" }}
          />
        </button>

        <div
          className="h-8 w-px mx-2"
          style={{ backgroundColor: "var(--color-slate-800)" }}
        />

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-lg transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-teal-500) 20%, transparent)",
                color: "var(--color-teal-400)",
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden sm:block">
              <p
                className="text-sm font-medium leading-none"
                style={{ color: "var(--color-white)" }}
              >
                {userName || "User"}
              </p>
              <p
                className="text-xs mt-1 capitalize"
                style={{ color: "var(--color-slate-400)" }}
              >
                {userRole || "Employee"}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isProfileOpen && "rotate-180"
              )}
              style={{ color: "var(--color-slate-400)" }}
            />
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-150"
                style={{
                  backgroundColor: "var(--color-slate-800)",
                  borderColor: "var(--color-slate-700)",
                  border: "1px solid",
                }}
              >
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Account Settings
                </button>
                <div
                  className="h-px my-1"
                  style={{ backgroundColor: "var(--color-slate-700)" }}
                />
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--color-red-500)" }}
                  onClick={() => {
                    // Handle logout logic here
                    document.cookie =
                      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                    window.location.href = "/auth/login";
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
