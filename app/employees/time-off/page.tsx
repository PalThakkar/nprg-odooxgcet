"use client";

import { useState } from "react";
import { CheckCircle, Heart } from "lucide-react";

export default function TimeOffPage() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Paid");
  const [reason, setReason] = useState("");

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
              Time Off Management
            </h1>
            <p style={{ color: "var(--color-slate-400)" }}>
              Request and manage your time off
            </p>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)}>
            + New Request
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Paid Time Off Available
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  24
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  days remaining
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))`,
                }}
              >
                <CheckCircle
                  size={24}
                  style={{ color: "var(--color-emerald-500)" }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  Sick Time Off Available
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-white)" }}
                >
                  7
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--color-slate-400)" }}
                >
                  days remaining
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.2))`,
                }}
              >
                <Heart size={24} style={{ color: "var(--color-red-500)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card-gradient rounded-2xl overflow-hidden">
          <div
            className="px-8 py-6"
            style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.5)" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-white)" }}
            >
              Time Off Requests
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
                    Employee
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Start Date
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    End Date
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Type
                  </th>
                  <th
                    className="px-8 py-4 text-left text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderColor: "rgba(51, 65, 85, 0.5)" }}>
                <tr className="table-row">
                  <td
                    className="px-8 py-4 font-medium"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    Emp Name
                  </td>
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
                    28/10/2025
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "var(--color-emerald-500)",
                      }}
                    >
                      Paid Leave
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(234, 179, 8, 0.2)",
                        color: "var(--color-yellow-500)",
                      }}
                    >
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="table-row">
                  <td
                    className="px-8 py-4 font-medium"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    Emp Name
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    20/10/2025
                  </td>
                  <td
                    className="px-8 py-4"
                    style={{ color: "var(--color-slate-300)" }}
                  >
                    21/10/2025
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "var(--color-blue-500)",
                      }}
                    >
                      Sick Leave
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "var(--color-emerald-500)",
                      }}
                    >
                      Approved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="w-full max-w-md rounded-2xl card-gradient p-8 space-y-6">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--color-white)" }}
              >
                Apply for Time Off
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-slate-400)" }}
              >
                Fill in the details below
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  Time Off Type
                </label>
                <select
                  className="input-field"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                  <option value="Personal">Personal Leave</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-slate-300)" }}
                >
                  Reason
                </label>
                <textarea
                  placeholder="Enter reason for time off..."
                  className="input-field resize-none h-24"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  console.log({ startDate, endDate, type, reason });
                  setOpen(false);
                  setStartDate("");
                  setEndDate("");
                  setType("Paid");
                  setReason("");
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
