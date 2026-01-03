"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, MessageSquare, Search } from "lucide-react";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  adminComment: string | null;
  user: {
    name: string;
    email: string;
    loginId: string;
  };
}

export default function AdminLeaveDashboard() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/leaves/admin");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    comment: string
  ) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/leaves/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminComment: comment }),
      });
      if (res.ok) {
        setLeaves((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status, adminComment: comment } : l
          )
        );
      }
    } catch (error) {
      console.error("Error updating leave:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLeaves = leaves.filter(
    (l) =>
      (l.user?.name || "").toLowerCase().includes(filter.toLowerCase()) ||
      (l.user?.loginId || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent relative z-10 p-4 md:p-8 font-mono">

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
        <div className="border-l-8 border-primary pl-6 py-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
            Leave Management
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
            Review and approve requests
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border-2 border-slate-700 p-2 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
          <Search className="w-5 h-5 text-primary ml-2" />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR ID..."
            className="w-64 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-slate-600 font-bold uppercase text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          title="Total Pending"
          count={leaves.filter((l) => l.status === "PENDING").length}
          color="pending"
          icon={<Clock className="w-8 h-8" />}
        />
        <StatCard
          title="Approved"
          count={leaves.filter((l) => l.status === "APPROVED").length}
          color="approved"
          icon={<Check className="w-8 h-8" />}
        />
        <StatCard
          title="Rejected"
          count={leaves.filter((l) => l.status === "REJECTED").length}
          color="rejected"
          icon={<X className="w-8 h-8" />}
        />
      </div>

      {/* Main Content */}
      <div className="brutal-card p-0 overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-slate-700 bg-slate-900">
          <h2 className="text-xl font-black uppercase tracking-wide text-white flex items-center gap-3">
            <span className="w-3 h-3 bg-primary inline-block" />
            Incoming Requests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 bg-slate-950/50">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Employee</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Type</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Dates</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Reason</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-right text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center font-bold uppercase text-slate-500 tracking-widest">
                    Loading requests...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <MessageSquare className="w-12 h-12 text-slate-700" />
                      <p className="font-bold uppercase text-slate-500 tracking-widest">No leave requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <LeaveRow
                    key={leave.id}
                    leave={leave}
                    onAction={handleAction}
                    isProcessing={processingId === leave.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  count,
  color,
  icon
}: {
  title: string;
  count: number;
  color: "pending" | "approved" | "rejected";
  icon?: React.ReactNode;
}) {
  const config = {
    pending: {
      border: "border-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      shadow: "shadow-amber-500/50"
    },
    approved: {
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      shadow: "shadow-emerald-500/50"
    },
    rejected: {
      border: "border-red-500",
      bg: "bg-red-500/10",
      text: "text-red-500",
      shadow: "shadow-red-500/50"
    },
  };

  const style = config[color];

  return (
    <div className={`p-6 border-2 ${style.border} ${style.bg} transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] bg-slate-900 group`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-sm font-black uppercase tracking-widest ${style.text}`}>
          {title}
        </p>
        <div className={`p-2 border-2 ${style.border} bg-slate-950 ${style.text}`}>
          {icon}
        </div>
      </div>
      <p className="text-5xl font-black text-white tracking-tighter">
        {count}
      </p>
    </div>
  );
}

function LeaveRow({
  leave,
  onAction,
  isProcessing,
}: {
  leave: LeaveRequest;
  onAction: (
    id: string,
    status: "APPROVED" | "REJECTED",
    comment: string
  ) => void;
  isProcessing: boolean;
}) {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);

  return (
    <tr className="hover:bg-slate-900 transition-colors group">
      <td className="p-6">
        <div>
          <p className="font-bold text-white group-hover:text-primary transition-colors text-lg uppercase tracking-tight">
            {leave.user.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-slate-800 px-2 py-0.5 border border-slate-700 text-slate-400 font-mono">
              {leave.user.loginId}
            </span>
          </div>
        </div>
      </td>
      <td className="p-6">
        <span
          className="inline-flex items-center border-2 border-slate-700 bg-slate-800 px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-300"
        >
          {leave.type}
        </span>
      </td>
      <td className="p-6">
        <div className="text-sm font-bold text-slate-300">
          {new Date(leave.startDate).toLocaleDateString()}
          <span className="text-slate-600 block text-xs uppercase font-normal mt-1">to</span>
          {new Date(leave.endDate).toLocaleDateString()}
        </div>
      </td>
      <td className="p-6">
        <p
          className="text-sm max-w-xs truncate text-slate-400 font-medium italic"
          title={leave.reason}
        >
          {leave.reason}
        </p>
      </td>
      <td className="p-6">
        <StatusBadge status={leave.status} />
      </td>
      <td className="p-6 text-right">
        {leave.status === "PENDING" ? (
          <div className="flex flex-col items-end gap-2">
            {!showComment ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowComment(true)}
                  className="px-4 py-2 border-2 border-slate-600 text-slate-400 font-bold uppercase text-xs hover:border-white hover:text-white transition-colors"
                >
                  Review
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-xs animate-in slide-in-from-right-2 duration-200 bg-slate-950 p-4 border-2 border-slate-700 shadow-xl z-20 absolute right-12 mt-[-50px]">
                <p className="text-xs font-bold text-slate-500 uppercase">Review Request</p>
                <input
                  type="text"
                  placeholder="ADD COMMENT (OPTIONAL)..."
                  className="h-8 text-xs bg-slate-900 border-2 border-slate-700 px-2 text-white placeholder-slate-600 focus:outline-none focus:border-primary uppercase font-bold"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    className="px-2 py-1 text-xs font-bold text-slate-500 hover:text-white uppercase"
                    onClick={() => setShowComment(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-red-500 text-slate-950 border-2 border-red-500 hover:bg-red-400 font-black uppercase"
                    onClick={() => onAction(leave.id, "REJECTED", comment)}
                    disabled={isProcessing}
                  >
                    Reject
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-primary text-slate-950 border-2 border-primary hover:bg-teal-400 font-black uppercase shadow-[2px_2px_0px_0px_white]"
                    onClick={() => onAction(leave.id, "APPROVED", comment)}
                    disabled={isProcessing}
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
            {leave.adminComment && (
              <span className="block mb-1 text-slate-600">"{leave.adminComment}"</span>
            )}
            Action Taken
          </div>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<
    string,
    { classes: string }
  > = {
    PENDING: {
      classes: "bg-amber-500 border-amber-600 text-black",
    },
    APPROVED: {
      classes: "bg-emerald-500 border-emerald-600 text-black",
    },
    REJECTED: {
      classes: "bg-red-500 border-red-600 text-white",
    },
  };

  return (
    <span
      className={`inline-flex items-center border-2 px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] ${styles[status].classes}`}
    >
      {status}
    </span>
  );
}
