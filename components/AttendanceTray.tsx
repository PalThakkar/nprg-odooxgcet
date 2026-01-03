"use client";

import React, { useState, useEffect } from "react";
import { LogIn, LogOut, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttendanceTray() {
  const [status, setStatus] = useState<"checked-out" | "checked-in">(
    "checked-out"
  );
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetchStatus();
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      if (data.attendance) {
        setStatus(data.attendance.checkOut ? "checked-out" : "checked-in");
      }
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async () => {
    setLoading(true);
    const action = status === "checked-in" ? "check-out" : "check-in";
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.attendance) {
        setStatus(action === "check-in" ? "checked-in" : "checked-out");
      }
    } catch (error) {
      console.error("Failed to toggle attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed bottom-8 right-8 z-40 rounded-2xl shadow-2xl p-4 w-72 animate-in slide-in-from-bottom-4 duration-300"
      style={{
        backgroundColor: "var(--color-slate-900)",
        borderColor: "var(--color-slate-700)",
        border: "1px solid",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full animate-pulse",
              status === "checked-in" ? "bg-green-500" : "bg-red-500"
            )}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-white)" }}
          >
            {status === "checked-in" ? "Working" : "Not Working"}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{ color: "var(--color-slate-400)" }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium font-mono">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <button
        onClick={toggleAttendance}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95",
          loading && "opacity-70 cursor-not-allowed"
        )}
        style={
          status === "checked-in"
            ? {
                backgroundColor:
                  "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
                color: "var(--color-red-500)",
              }
            : {
                background:
                  "linear-gradient(135deg, var(--color-teal-600), var(--color-emerald-600))",
                color: "var(--color-white)",
              }
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "checked-in" ? (
          <>
            <LogOut className="w-4 h-4" />
            Check Out
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Check IN
          </>
        )}
      </button>

      <p
        className="text-[10px] text-center mt-3 uppercase tracking-wider font-semibold"
        style={{ color: "var(--color-slate-400)" }}
      >
        Attendance recorded in cloud
      </p>
    </div>
  );
}
