"use client";

import { useState } from "react";

export default function AttendancePage() {
  const [month, setMonth] = useState(9); // October (0-based)
  const year = 2025;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-border px-3 py-1"
            onClick={() => setMonth((m) => Math.max(0, m - 1))}
          >
            ←
          </button>
          <span className="text-muted-foreground">
            {new Date(year, month).toLocaleString("default", { month: "long" })}{" "}
            {year}
          </span>
          <button
            className="rounded-lg border border-border px-3 py-1"
            onClick={() => setMonth((m) => Math.min(11, m + 1))}
          >
            →
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-muted-foreground">Count of days present</p>
          <p className="text-xl font-semibold">22</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-muted-foreground">Leaves count</p>
          <p className="text-xl font-semibold">2</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-muted-foreground">Total working days</p>
          <p className="text-xl font-semibold">24</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Check In</th>
              <th className="p-4 text-left">Check Out</th>
              <th className="p-4 text-left">Work Hours</th>
              <th className="p-4 text-left">Extra Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4">28/10/2025</td>
              <td className="p-4">10:00</td>
              <td className="p-4">19:00</td>
              <td className="p-4">09:00</td>
              <td className="p-4">01:00</td>
            </tr>
            <tr>
              <td className="p-4">29/10/2025</td>
              <td className="p-4">10:00</td>
              <td className="p-4">19:00</td>
              <td className="p-4">09:00</td>
              <td className="p-4">01:00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
