"use client";

import { useState } from "react";
import { CheckCircle, Calendar, Clock } from "lucide-react";

export default function AttendancePage() {
  const [month, setMonth] = useState(9); // October (0-based)
  const year = 2025;

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(to bottom right, var(--color-slate-950), var(--color-slate-900), var(--color-slate-950))`,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "var(--color-white)" }}
            >
              Attendance
            </h1>
            <p style={{ color: "var(--color-slate-400)" }}>
              Track your daily attendance and work hours
            </p>
          </div>

          <div
            className="flex items-center gap-3 rounded-lg p-2"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              borderColor: "var(--color-slate-700)",
              borderWidth: "1px",
            }}
          >
            <button
              className="btn-secondary"
              onClick={() => setMonth((m) => Math.max(0, m - 1))}
            >
              ← Prev
            </button>
            <span
              className="font-medium min-w-max"
              style={{ color: "var(--color-slate-300)" }}
            >
              {new Date(year, month).toLocaleString("default", {
                month: "long",
              })}{" "}
              {year}
            </span>
            <button
              className="btn-secondary"
              onClick={() => setMonth((m) => Math.min(11, m + 1))}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Days Present
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  22
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.2))`,
                }}
              >
                <CheckCircle size={24} style={{ color: "var(--primary)" }} />
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--primary)" }}>
              +2 from last month
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Total Leaves
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  2
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))`,
                }}
              >
                <Calendar
                  size={24}
                  style={{ color: "var(--color-orange-500)" }}
                />
              </div>
            </div>
            <p
              className="text-xs mt-4"
              style={{ color: "var(--color-slate-400)" }}
            >
              Approved leaves
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Working Days
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  24
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(34, 211, 238, 0.2))`,
                }}
              >
                <Clock size={24} style={{ color: "var(--color-blue-500)" }} />
              </div>
            </div>
            <p
              className="text-xs mt-4"
              style={{ color: "var(--color-cyan-400)" }}
            >
              Total in month
            </p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card-gradient rounded-2xl overflow-hidden">
          <div
            className="px-8 py-6"
            style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.5)" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-white)" }}
            >
              Recent Attendance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
                }}
              >
                <tr>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Date
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Check In
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Check Out
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Work Hours
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Extra Hours
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "rgba(51, 65, 85, 0.5)" }}>
                <tr className="table-row">
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    28/10/2025
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    10:00 AM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    19:00 PM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    09:00 hrs
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="font-semibold"
                      style={{ color: "var(--primary)" }}
                    >
                      +01:00
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    29/10/2025
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    10:00 AM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    19:00 PM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    09:00 hrs
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="font-semibold"
                      style={{ color: "var(--primary)" }}
                    >
                      +01:00
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    30/10/2025
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    09:30 AM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    18:30 PM
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    09:00 hrs
                  </td>
                  <td className="px-8 py-4">
                    <span style={{ color: "var(--color-slate-400)" }}>
                      00:00
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
