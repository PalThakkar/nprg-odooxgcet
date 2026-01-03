"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Heart, Loader2, AlertCircle } from "lucide-react";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason: string;
}

interface LeaveBalance {
  paidDaysLeft: number;
  sickDaysLeft: number;
}

export default function TimeOffPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Paid");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/leaves");
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
        setBalance(data.balance);
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, type, reason }),
      });
      if (res.ok) {
        const newLeave = await res.json();
        setRequests([newLeave, ...requests]);
        setOpen(false);
        setStartDate("");
        setEndDate("");
        setReason("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request");
      }
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

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

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

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
                  {balance?.paidDaysLeft ?? 24}
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
                  {balance?.sickDaysLeft ?? 7}
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
              My Time Off Requests
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
                    Dates
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
                    Reason
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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                        <p className="text-sm text-slate-400">Loading your requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center">
                      <p className="text-sm text-slate-400">No time off requests found.</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="table-row">
                      <td
                        className="px-8 py-4"
                        style={{ color: "var(--color-slate-300)" }}
                      >
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-sm font-medium" style={{ color: "var(--color-slate-300)" }}>
                        {req.type}
                      </td>
                      <td className="px-8 py-4 text-sm max-w-xs truncate" style={{ color: "var(--color-slate-400)" }}>
                        {req.reason}
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                          style={getStatusBadgeStyle(req.status)}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
                className="btn-primary flex items-center gap-2"
                onClick={handleSubmit}
                disabled={submitting || !startDate || !endDate || !reason}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return { backgroundColor: "rgba(234, 179, 8, 0.2)", color: "var(--color-yellow-500)" };
    case 'APPROVED':
      return { backgroundColor: "rgba(16, 185, 129, 0.2)", color: "var(--color-emerald-500)" };
    case 'REJECTED':
      return { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "var(--color-red-500)" };
    default:
      return { backgroundColor: "rgba(148, 163, 184, 0.2)", color: "var(--color-slate-400)" };
  }
}
