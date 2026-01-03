"use client";

import { useState } from "react";

export default function TimeOffPage() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Paid");
  const [reason, setReason] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Time Off</h1>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          NEW
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-muted-foreground">Paid time off</p>
          <p className="text-xl font-semibold">24 days available</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-muted-foreground">Sick time off</p>
          <p className="text-xl font-semibold">7 days available</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Start Date</th>
              <th className="p-4 text-left">End Date</th>
              <th className="p-4 text-left">Time off Type</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4">Emp Name</td>
              <td className="p-4">28/10/2025</td>
              <td className="p-4">28/10/2025</td>
              <td className="p-4 text-blue-400">Paid time off</td>
              <td className="p-4 text-muted-foreground">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[420px] rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Apply Time Off</h2>

            <input
              type="date"
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Paid">Paid</option>
              <option value="Sick">Sick</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <textarea
              placeholder="Reason"
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                onClick={() => {
                  console.log({ startDate, endDate, type, reason });
                  setOpen(false);
                }}
              >
                Submit
              </button>
              <button
                className="rounded-lg border border-border px-4 py-2"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
