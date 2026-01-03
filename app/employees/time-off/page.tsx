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
    <div className="min-h-screen p-8 bg-slate-950 font-mono relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-slate-800)_1px,transparent_1px),linear-gradient(90deg,var(--color-slate-800)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
          <div className="border-l-8 border-primary pl-6 py-2">
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
              Time Off
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              Request and manage your leaves
            </p>
          </div>
          <button className="btn-primary" onClick={() => setOpen(true)}>
            + New Request
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 p-4 flex items-center gap-3 text-red-500 shadow-[4px_4px_0px_0px_var(--color-red-500)]">
            <AlertCircle size={20} />
            <p className="font-bold uppercase tracking-wide">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="stat-card group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400 group-hover:text-primary transition-colors">
                  Paid Time Off
                </p>
                <p className="text-6xl font-black text-white mb-2 tracking-tighter">
                  {balance?.paidDaysLeft ?? 24}
                </p>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-500">
                  days remaining
                </p>
              </div>
              <div className="w-16 h-16 border-2 border-emerald-500 bg-emerald-500/10 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-emerald-500)]">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400 group-hover:text-red-500 transition-colors">
                  Sick Leave
                </p>
                <p className="text-6xl font-black text-white mb-2 tracking-tighter">
                  {balance?.sickDaysLeft ?? 7}
                </p>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-500">
                  days remaining
                </p>
              </div>
              <div className="w-16 h-16 border-2 border-red-500 bg-red-500/10 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-red-500)]">
                <Heart size={32} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="brutal-card p-0 overflow-hidden">
          <div className="px-8 py-6 border-b-2 border-slate-700 bg-slate-900">
            <h2 className="text-xl font-black uppercase tracking-wide text-white flex items-center gap-3">
              <span className="w-3 h-3 bg-primary inline-block" />
              My Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/50 border-b-2 border-slate-700">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-400">Dates</th>
                  <th className="px-8 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-8 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-400">Reason</th>
                  <th className="px-8 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center">
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No requests history found.</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-200">
                        {new Date(req.startDate).toLocaleDateString()} <span className="text-slate-600 mx-2">→</span> {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold text-primary uppercase tracking-wider text-sm">{req.type}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-400 max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className="px-3 py-1 text-xs font-black uppercase tracking-widest border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-2 border-primary p-8 shadow-[12px_12px_0px_0px_var(--color-primary)] animate-in fade-in zoom-in duration-200">
            <div className="mb-8 border-b-2 border-slate-800 pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                New Request
              </h2>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wide">
                Submit time off details
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
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
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Leave Type
                </label>
                <select
                  className="input-field"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Paid">PAID LEAVE</option>
                  <option value="Sick">SICK LEAVE</option>
                  <option value="Unpaid">UNPAID LEAVE</option>
                  <option value="Personal">PERSONAL LEAVE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Reason
                </label>
                <textarea
                  placeholder="Why do you need time off?"
                  className="input-field resize-none h-32"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t-2 border-slate-800">
              <button
                className="flex-1 btn-secondary text-center justify-center"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 btn-primary text-center justify-center flex items-center gap-2"
                onClick={handleSubmit}
                disabled={submitting || !startDate || !endDate || !reason}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
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
      return {
        backgroundColor: "var(--color-yellow-500)",
        borderColor: "var(--color-yellow-600)",
        color: "#000"
      };
    case 'APPROVED':
      return {
        backgroundColor: "var(--color-emerald-500)",
        borderColor: "var(--color-emerald-600)",
        color: "#000"
      };
    case 'REJECTED':
      return {
        backgroundColor: "var(--color-red-500)",
        borderColor: "var(--color-red-600)",
        color: "#fff"
      };
    default:
      return {
        backgroundColor: "var(--color-slate-700)",
        borderColor: "var(--color-slate-600)",
        color: "var(--color-slate-300)"
      };
  }
}
