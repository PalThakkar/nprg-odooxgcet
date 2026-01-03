"use client";

import { useEffect, useState } from "react";
import { Loader2, Bell, Trash2, Send, X, Star, AlertTriangle, Info, Check, Search } from "lucide-react";

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
        if (diffMins < 60) return `${diffMins}M AGO`;
        if (diffHours < 24) return `${diffHours}H AGO`;
        if (diffDays < 7) return `${diffDays}D AGO`;
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase();
    };

    const getTypeConfig = (type: string) => {
        switch (type) {
            case "ANNOUNCEMENT":
                return {
                    color: "blue",
                    icon: <Info className="w-4 h-4" />,
                    bg: "bg-blue-900/20",
                    border: "border-blue-500",
                    text: "text-blue-500",
                };
            case "ALERT":
                return {
                    color: "red",
                    icon: <AlertTriangle className="w-4 h-4" />,
                    bg: "bg-red-900/20",
                    border: "border-red-500",
                    text: "text-red-500",
                };
            case "SYSTEM":
                return {
                    color: "purple",
                    icon: <Check className="w-4 h-4" />,
                    bg: "bg-purple-900/20",
                    border: "border-purple-500",
                    text: "text-purple-500",
                };
            default:
                return {
                    color: "slate",
                    icon: <Bell className="w-4 h-4" />,
                    bg: "bg-slate-800",
                    border: "border-slate-500",
                    text: "text-slate-400",
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <div className="font-black uppercase text-xl text-white tracking-widest">Loading Alerts...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen font-mono bg-transparent relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
                        Notifications Center
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
                        Manage Alerts & Broadcasts
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-950 font-black uppercase tracking-wider border-2 border-primary shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    <Send className="w-4 h-4" />
                    Send New Message
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="brutal-card p-4 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
                    <div className="text-3xl font-black text-white mb-1">{summary.total}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Sent</div>
                </div>
                <div className="brutal-card p-4 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
                    <div className="text-3xl font-black text-amber-500 mb-1">{summary.unread}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unread</div>
                </div>
                <div className="brutal-card p-4 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
                    <div className="text-3xl font-black text-blue-500 mb-1">{summary.byType["ANNOUNCEMENT"] || 0}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Announcements</div>
                </div>
                <div className="brutal-card p-4 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)]">
                    <div className="text-3xl font-black text-red-500 mb-1">{summary.byType["ALERT"] || 0}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alerts</div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {["all", "ANNOUNCEMENT", "ALERT", "SYSTEM"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all
                            ${filterType === type
                                ? "bg-white border-white text-slate-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                            }`}
                    >
                        {type === "all" ? "All Messages" : type}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const config = getTypeConfig(notif.type);
                        return (
                            <div
                                key={notif.id}
                                className={`group relative p-6 bg-slate-900 border-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-slate-800)]
                                    ${notif.isRead ? "border-slate-800" : `border-${config.color}-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]`}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.border} ${config.text}`}>
                                                {notif.type}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
                                                {formatDate(notif.createdAt)}
                                            </span>
                                            {!notif.isRead && (
                                                <span className="h-2 w-2 rounded-none bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
                                            )}
                                        </div>
                                        <h3 className="font-black text-xl text-white mb-2 uppercase tracking-tight">
                                            {notif.title}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-400 mb-4 leading-relaxed max-w-2xl">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-bold text-slate-600 uppercase tracking-wider">Sent to:</span>
                                            <span className="font-mono text-slate-300 bg-slate-950 px-2 py-1 border border-slate-800">
                                                {notif.userName} <span className="text-slate-600">|</span> {notif.employeeId || notif.userEmail}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        className="p-3 bg-slate-950 border-2 border-slate-800 text-slate-500 hover:border-red-500 hover:text-red-500 hover:bg-red-900/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 bg-slate-900/50">
                        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                            <Bell className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No notifications found</p>
                    </div>
                )}
            </div>

            {/* Send Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 shadow-[8px_8px_0px_0px_var(--color-slate-800)] p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8 border-b-2 border-slate-800 pb-4">
                            <h2 className="text-xl font-black uppercase text-white tracking-tight">
                                New Message
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Type */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Message Type
                                </label>
                                <select
                                    value={newNotification.type}
                                    onChange={(e) => setNewNotification((prev) => ({ ...prev, type: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 text-white font-bold text-sm focus:border-primary focus:outline-none uppercase"
                                >
                                    <option value="ANNOUNCEMENT">📢 Announcement</option>
                                    <option value="ALERT">🚨 Alert</option>
                                    <option value="SYSTEM">⚙️ System</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value }))}
                                    placeholder="ENTER TITLE..."
                                    className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 text-white font-bold text-sm focus:border-primary focus:outline-none placeholder:text-slate-700"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
                                    placeholder="ENTER MESSAGE..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 text-white font-bold text-sm focus:border-primary focus:outline-none placeholder:text-slate-700 resize-none"
                                />
                            </div>

                            {/* Recipients */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                                    Recipients
                                </label>
                                <div className="flex items-center gap-6 mb-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${newNotification.sendToAll ? 'border-primary bg-primary' : 'border-slate-600 bg-slate-950 group-hover:border-primary'}`}>
                                            {newNotification.sendToAll && <Check className="w-3 h-3 text-slate-950" />}
                                        </div>
                                        <input
                                            type="radio"
                                            checked={newNotification.sendToAll}
                                            onChange={() => setNewNotification((prev) => ({ ...prev, sendToAll: true }))}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-bold uppercase text-white">All Employees</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${!newNotification.sendToAll ? 'border-primary bg-primary' : 'border-slate-600 bg-slate-950 group-hover:border-primary'}`}>
                                            {!newNotification.sendToAll && <Check className="w-3 h-3 text-slate-950" />}
                                        </div>
                                        <input
                                            type="radio"
                                            checked={!newNotification.sendToAll}
                                            onChange={() => setNewNotification((prev) => ({ ...prev, sendToAll: false }))}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-bold uppercase text-white">Select Specific</span>
                                    </label>
                                </div>

                                {!newNotification.sendToAll && (
                                    <div className="max-h-48 overflow-y-auto bg-slate-950 border-2 border-slate-800 p-2 custom-scrollbar">
                                        <div className="sticky top-0 bg-slate-950 border-b border-slate-800 p-2 mb-2">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2 w-4 h-4 text-slate-600" />
                                                <input
                                                    type="text"
                                                    placeholder="SEARCH..."
                                                    className="w-full bg-slate-900 border border-slate-700 pl-8 pr-2 py-1 text-xs text-white uppercase focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        {employees.map((emp) => (
                                            <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-900 cursor-pointer transition-colors group">
                                                <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${newNotification.selectedEmployees.includes(emp.id) ? 'border-primary bg-primary' : 'border-slate-700 bg-slate-950 group-hover:border-primary'}`}>
                                                    {newNotification.selectedEmployees.includes(emp.id) && <Check className="w-3 h-3 text-slate-950" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={newNotification.selectedEmployees.includes(emp.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewNotification((prev) => ({ ...prev, selectedEmployees: [...prev.selectedEmployees, emp.id] }));
                                                        } else {
                                                            setNewNotification((prev) => ({ ...prev, selectedEmployees: prev.selectedEmployees.filter((id) => id !== emp.id) }));
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                <div>
                                                    <div className="text-sm font-black uppercase text-white">{emp.name}</div>
                                                    <div className="text-[10px] font-mono text-slate-500">[{emp.employeeId}] {emp.department}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t-2 border-slate-800">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 bg-slate-950 border-2 border-slate-700 text-slate-400 font-black uppercase tracking-wider hover:border-white hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendNotification}
                                    disabled={sending}
                                    className="flex-1 px-6 py-3 bg-primary border-2 border-primary text-slate-950 font-black uppercase tracking-wider hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
