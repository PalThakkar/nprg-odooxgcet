"use client";

import { useEffect, useState } from "react";

interface Notification {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    employeeId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Employee {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    department: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filterType, setFilterType] = useState<string>("all");
    const [summary, setSummary] = useState<{
        total: number;
        unread: number;
        byType: Record<string, number>;
    }>({ total: 0, unread: 0, byType: {} });

    const [newNotification, setNewNotification] = useState({
        title: "",
        message: "",
        type: "ANNOUNCEMENT",
        sendToAll: true,
        selectedEmployees: [] as string[],
    });

    useEffect(() => {
        fetchNotifications();
        fetchEmployees();
    }, [filterType]);

    const fetchNotifications = async () => {
        try {
            const typeParam = filterType !== "all" ? `?type=${filterType}` : "";
            const res = await fetch(`/api/admin/notifications${typeParam}`);
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data.notifications);
                setSummary(data.data.summary);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/admin/employees");
            const data = await res.json();
            if (data.success) {
                setEmployees(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const sendNotification = async () => {
        if (!newNotification.title.trim() || !newNotification.message.trim()) {
            alert("Please fill in title and message");
            return;
        }

        setSending(true);
        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newNotification.title,
                    message: newNotification.message,
                    type: newNotification.type,
                    sendToAll: newNotification.sendToAll,
                    userIds: newNotification.sendToAll
                        ? undefined
                        : newNotification.selectedEmployees,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setNewNotification({
                    title: "",
                    message: "",
                    type: "ANNOUNCEMENT",
                    sendToAll: true,
                    selectedEmployees: [],
                });
                fetchNotifications();
            } else {
                alert(data.error || "Failed to send notification");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            alert("Error sending notification");
        } finally {
            setSending(false);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;

        try {
            const res = await fetch(`/api/admin/notifications?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "ANNOUNCEMENT":
                return {
                    bg: "color-mix(in srgb, var(--color-blue-500) 20%, transparent)",
                    text: "var(--color-blue-400)",
                };
            case "ALERT":
                return {
                    bg: "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
                    text: "var(--color-red-400)",
                };
            case "SYSTEM":
                return {
                    bg: "color-mix(in srgb, var(--color-purple-500) 20%, transparent)",
                    text: "var(--color-purple-400)",
                };
            default:
                return {
                    bg: "color-mix(in srgb, var(--color-slate-500) 20%, transparent)",
                    text: "var(--color-slate-400)",
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                    style={{ borderColor: "var(--color-teal-500)" }}
                ></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1
                        className="text-3xl font-black tracking-tight"
                        style={{ color: "var(--color-white)" }}
                    >
                        Notifications & Alerts
                    </h1>
                    <p style={{ color: "var(--color-slate-400)" }}>
                        Send and manage notifications to employees
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                    style={{
                        background:
                            "linear-gradient(to right, var(--color-teal-500), var(--color-emerald-500))",
                        color: "var(--color-white)",
                    }}
                >
                    <span>✉️</span>
                    Send Notification
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: "var(--color-slate-900)",
                        border: "1px solid var(--color-slate-800)",
                    }}
                >
                    <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-teal-400)" }}
                    >
                        {summary.total}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-slate-500)" }}>
                        Total Sent
                    </div>
                </div>
                <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: "var(--color-slate-900)",
                        border: "1px solid var(--color-slate-800)",
                    }}
                >
                    <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-amber-400)" }}
                    >
                        {summary.unread}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-slate-500)" }}>
                        Unread
                    </div>
                </div>
                <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: "var(--color-slate-900)",
                        border: "1px solid var(--color-slate-800)",
                    }}
                >
                    <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-blue-400)" }}
                    >
                        {summary.byType["ANNOUNCEMENT"] || 0}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-slate-500)" }}>
                        Announcements
                    </div>
                </div>
                <div
                    className="rounded-xl p-4"
                    style={{
                        backgroundColor: "var(--color-slate-900)",
                        border: "1px solid var(--color-slate-800)",
                    }}
                >
                    <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-red-400)" }}
                    >
                        {summary.byType["ALERT"] || 0}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-slate-500)" }}>
                        Alerts
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div
                className="flex gap-2 p-1 rounded-xl w-fit"
                style={{ backgroundColor: "var(--color-slate-800)" }}
            >
                {["all", "ANNOUNCEMENT", "ALERT", "SYSTEM"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                        style={{
                            backgroundColor:
                                filterType === type ? "var(--color-teal-500)" : "transparent",
                            color:
                                filterType === type
                                    ? "var(--color-white)"
                                    : "var(--color-slate-400)",
                        }}
                    >
                        {type === "all" ? "All" : type.toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const typeColor = getTypeColor(notif.type);
                        return (
                            <div
                                key={notif.id}
                                className="rounded-xl p-5 transition-all hover:scale-[1.01]"
                                style={{
                                    backgroundColor: "var(--color-slate-900)",
                                    border: notif.isRead
                                        ? "1px solid var(--color-slate-800)"
                                        : "1px solid var(--color-teal-500/50)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className="px-2 py-1 rounded-md text-xs font-semibold uppercase"
                                                style={{
                                                    backgroundColor: typeColor.bg,
                                                    color: typeColor.text,
                                                }}
                                            >
                                                {notif.type}
                                            </span>
                                            <span
                                                className="text-xs"
                                                style={{ color: "var(--color-slate-500)" }}
                                            >
                                                {formatDate(notif.createdAt)}
                                            </span>
                                            {!notif.isRead && (
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: "var(--color-teal-500)" }}
                                                ></span>
                                            )}
                                        </div>
                                        <h3
                                            className="font-bold text-lg mb-1"
                                            style={{ color: "var(--color-white)" }}
                                        >
                                            {notif.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-3"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            {notif.message}
                                        </p>
                                        <div
                                            className="flex items-center gap-2 text-xs"
                                            style={{ color: "var(--color-slate-500)" }}
                                        >
                                            <span>Sent to:</span>
                                            <span
                                                className="font-medium"
                                                style={{ color: "var(--color-slate-300)" }}
                                            >
                                                {notif.userName} ({notif.employeeId || notif.userEmail})
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                                        style={{ color: "var(--color-red-400)" }}
                                        title="Delete notification"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div
                        className="text-center py-12 rounded-xl"
                        style={{
                            backgroundColor: "var(--color-slate-900)",
                            border: "1px solid var(--color-slate-800)",
                        }}
                    >
                        <div className="text-4xl mb-4">📭</div>
                        <p style={{ color: "var(--color-slate-400)" }}>
                            No notifications found
                        </p>
                    </div>
                )}
            </div>

            {/* Send Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div
                        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                        style={{
                            backgroundColor: "var(--color-slate-900)",
                            border: "1px solid var(--color-slate-700)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="text-xl font-bold"
                                style={{ color: "var(--color-white)" }}
                            >
                                Send Notification
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-2xl"
                                style={{ color: "var(--color-slate-400)" }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Type */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-slate-300)" }}
                                >
                                    Type
                                </label>
                                <select
                                    value={newNotification.type}
                                    onChange={(e) =>
                                        setNewNotification((prev) => ({
                                            ...prev,
                                            type: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-3 rounded-xl text-sm"
                                    style={{
                                        backgroundColor: "var(--color-slate-800)",
                                        color: "var(--color-white)",
                                        border: "1px solid var(--color-slate-700)",
                                    }}
                                >
                                    <option value="ANNOUNCEMENT">📢 Announcement</option>
                                    <option value="ALERT">🚨 Alert</option>
                                    <option value="SYSTEM">⚙️ System</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-slate-300)" }}
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNotification.title}
                                    onChange={(e) =>
                                        setNewNotification((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter notification title"
                                    className="w-full px-4 py-3 rounded-xl text-sm"
                                    style={{
                                        backgroundColor: "var(--color-slate-800)",
                                        color: "var(--color-white)",
                                        border: "1px solid var(--color-slate-700)",
                                    }}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-slate-300)" }}
                                >
                                    Message
                                </label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) =>
                                        setNewNotification((prev) => ({
                                            ...prev,
                                            message: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter notification message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                    style={{
                                        backgroundColor: "var(--color-slate-800)",
                                        color: "var(--color-white)",
                                        border: "1px solid var(--color-slate-700)",
                                    }}
                                />
                            </div>

                            {/* Recipients */}
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-slate-300)" }}
                                >
                                    Recipients
                                </label>
                                <div className="flex items-center gap-4 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={newNotification.sendToAll}
                                            onChange={() =>
                                                setNewNotification((prev) => ({
                                                    ...prev,
                                                    sendToAll: true,
                                                }))
                                            }
                                            className="accent-teal-500"
                                        />
                                        <span
                                            className="text-sm"
                                            style={{ color: "var(--color-slate-300)" }}
                                        >
                                            All Employees
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!newNotification.sendToAll}
                                            onChange={() =>
                                                setNewNotification((prev) => ({
                                                    ...prev,
                                                    sendToAll: false,
                                                }))
                                            }
                                            className="accent-teal-500"
                                        />
                                        <span
                                            className="text-sm"
                                            style={{ color: "var(--color-slate-300)" }}
                                        >
                                            Select Employees
                                        </span>
                                    </label>
                                </div>

                                {!newNotification.sendToAll && (
                                    <div
                                        className="max-h-40 overflow-y-auto rounded-xl p-3 space-y-2"
                                        style={{
                                            backgroundColor: "var(--color-slate-800)",
                                            border: "1px solid var(--color-slate-700)",
                                        }}
                                    >
                                        {employees.map((emp) => (
                                            <label
                                                key={emp.id}
                                                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-700/50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newNotification.selectedEmployees.includes(
                                                        emp.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewNotification((prev) => ({
                                                                ...prev,
                                                                selectedEmployees: [
                                                                    ...prev.selectedEmployees,
                                                                    emp.id,
                                                                ],
                                                            }));
                                                        } else {
                                                            setNewNotification((prev) => ({
                                                                ...prev,
                                                                selectedEmployees: prev.selectedEmployees.filter(
                                                                    (id) => id !== emp.id
                                                                ),
                                                            }));
                                                        }
                                                    }}
                                                    className="accent-teal-500"
                                                />
                                                <div>
                                                    <div
                                                        className="text-sm font-medium"
                                                        style={{ color: "var(--color-white)" }}
                                                    >
                                                        {emp.name}
                                                    </div>
                                                    <div
                                                        className="text-xs"
                                                        style={{ color: "var(--color-slate-500)" }}
                                                    >
                                                        {emp.employeeId} • {emp.department || "No Dept"}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                                    style={{
                                        backgroundColor: "var(--color-slate-800)",
                                        color: "var(--color-slate-300)",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendNotification}
                                    disabled={sending}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                                    style={{
                                        background:
                                            "linear-gradient(to right, var(--color-teal-500), var(--color-emerald-500))",
                                        color: "var(--color-white)",
                                    }}
                                >
                                    {sending ? "Sending..." : "Send Notification"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
