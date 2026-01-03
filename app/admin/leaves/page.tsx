"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen text-foreground">
      <div className="home-bg"></div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Leave Management</h1>
          <p style={{ color: "var(--muted-foreground)" }}>Review and approve employee leave requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-64 bg-card border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
        <StatCard
          title="Total Pending"
          count={leaves.filter((l) => l.status === "PENDING").length}
          color="pending"
        />
        <StatCard
          title="Approved"
          count={leaves.filter((l) => l.status === "APPROVED").length}
          color="approved"
        />
        <StatCard
          title="Rejected"
          count={leaves.filter((l) => l.status === "REJECTED").length}
          color="rejected"
        />
      </div>

      {/* Main Content */}
      <div className="card-gradient rounded-3xl border border-border/50 overflow-hidden backdrop-blur-sm mx-8 mb-8 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Employee</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Type</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Dates</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Reason</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Status</th>
                <th className="p-6 text-xs font-bold uppercase tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                    Loading requests...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                    No leave requests found.
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
}: {
  title: string;
  count: number;
  color: "pending" | "approved" | "rejected";
}) {
  const badgeStyles = {
    pending: {
      backgroundColor: "color-mix(in srgb, #eab308 20%, transparent)",
      color: "#eab308",
    },
    approved: {
      backgroundColor:
        "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)",
      color: "var(--color-emerald-500)",
    },
    rejected: {
      backgroundColor:
        "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
      color: "var(--color-red-500)",
    },
  };

  return (
    <div className="p-6 rounded-3xl card-gradient border border-border/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          {title}
        </p>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={badgeStyles[color]}
        >
          {count}
        </span>
      </div>
      <p className="text-3xl font-bold mt-2" style={{ color: "var(--foreground)" }}>
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
    <tr className="hover:bg-card/20 transition-colors group">
      <td className="p-6">
        <div>
          <p className="font-semibold group-hover:text-primary transition-colors" style={{ color: "var(--foreground)" }}>
            {leave.user.name}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {leave.user.loginId} • {leave.user.email}
          </p>
        </div>
      </td>
      <td className="p-6">
        <span
          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-teal-500) 20%, transparent)",
            color: "var(--color-teal-500)",
            borderColor:
              "color-mix(in srgb, var(--color-teal-500) 20%, transparent)",
          }}
        >
          {leave.type}
        </span>
      </td>
      <td className="p-6">
        <div className="text-sm">
          <p style={{ color: "var(--foreground)" }}>
            {new Date(leave.startDate).toLocaleDateString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            to {new Date(leave.endDate).toLocaleDateString()}
          </p>
        </div>
      </td>
      <td className="p-6">
        <p
          className="text-sm max-w-50 truncate"
          style={{ color: "var(--muted-foreground)" }}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowComment(true)}
                  className="h-8"
                >
                  Action
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-50 animate-in slide-in-from-right-2 duration-200">
                <input
                  type="text"
                  placeholder="Admin comment..."
                  className="h-8 text-xs bg-card border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                    onClick={() => setShowComment(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 px-2 text-xs"
                    onClick={() => onAction(leave.id, "REJECTED", comment)}
                    disabled={isProcessing}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => onAction(leave.id, "APPROVED", comment)}
                    disabled={isProcessing}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
            {leave.adminComment || "No comment"}
          </div>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<
    string,
    { backgroundColor: string; color: string; borderColor: string }
  > = {
    PENDING: {
      backgroundColor: "color-mix(in srgb, #eab308 20%, transparent)",
      color: "#eab308",
      borderColor: "color-mix(in srgb, #eab308 20%, transparent)",
    },
    APPROVED: {
      backgroundColor:
        "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)",
      color: "var(--color-emerald-500)",
      borderColor:
        "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)",
    },
    REJECTED: {
      backgroundColor:
        "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
      color: "var(--color-red-500)",
      borderColor: "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
    },
  };

  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
      style={styles[status]}
    >
      {status}
    </span>
  );
}
