"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
    overview: {
        totalEmployees: number;
        presentToday: number;
        absentToday: number;
        attendanceRate: number;
    };
    departments: { name: string; count: number }[];
    weeklyAttendance: { date: string; count: number }[];
    leaves: {
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    };
    salary: {
        averageMonthly: number;
        totalMonthly: number;
        minSalary: number;
        maxSalary: number;
    };
    payroll: {
        currentMonth: string;
        totalPayout: number;
        employeesProcessed: number;
    };
    notifications: {
        unread: number;
    };
}

interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    date: string;
    checkIn: string;
    checkOut: string | null;
    workHours: number | null;
    status: string;
}

interface SalarySlip {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    monthlyWage: number;
    basic: number;
    hra: number;
    pfEmployee: number;
    professionalTax: number;
    grossEarnings: number;
    totalDeductions: number;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [attendanceReport, setAttendanceReport] = useState<AttendanceRecord[]>([]);
    const [salaryReport, setSalaryReport] = useState<SalarySlip[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "salary">("overview");
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (activeTab === "attendance") {
            fetchAttendanceReport();
        } else if (activeTab === "salary") {
            fetchSalaryReport();
        }
    }, [activeTab, dateRange]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/admin/analytics");
            const data = await res.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceReport = async () => {
        try {
            const res = await fetch(
                `/api/admin/reports/attendance?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
            );
            const data = await res.json();
            if (data.success) {
                setAttendanceReport(data.data.records);
            }
        } catch (error) {
            console.error("Error fetching attendance report:", error);
        }
    };

    const fetchSalaryReport = async () => {
        try {
            const res = await fetch("/api/admin/reports/salary");
            const data = await res.json();
            if (data.success) {
                setSalaryReport(data.data.salarySlips);
            }
        } catch (error) {
            console.error("Error fetching salary report:", error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
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
                        Analytics & Reports
                    </h1>
                    <p style={{ color: "var(--color-slate-400)" }}>
                        View comprehensive insights and generate reports
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div
                className="flex gap-2 p-1 rounded-xl w-fit"
                style={{ backgroundColor: "var(--color-slate-800)" }}
            >
                {["overview", "attendance", "salary"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className="px-6 py-3 rounded-lg text-sm font-semibold transition-all capitalize"
                        style={{
                            backgroundColor:
                                activeTab === tab ? "var(--color-teal-500)" : "transparent",
                            color:
                                activeTab === tab
                                    ? "var(--color-white)"
                                    : "var(--color-slate-400)",
                        }}
                    >
                        {tab === "salary" ? "Salary Slips" : tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && analytics && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Employees"
                            value={analytics.overview.totalEmployees.toString()}
                            icon="👥"
                            color="teal"
                        />
                        <StatCard
                            title="Present Today"
                            value={analytics.overview.presentToday.toString()}
                            subtitle={`${analytics.overview.attendanceRate}% attendance rate`}
                            icon="✅"
                            color="emerald"
                        />
                        <StatCard
                            title="Absent Today"
                            value={analytics.overview.absentToday.toString()}
                            icon="❌"
                            color="red"
                        />
                        <StatCard
                            title="Pending Leaves"
                            value={analytics.leaves.pending.toString()}
                            subtitle={`${analytics.leaves.total} total requests`}
                            icon="📋"
                            color="amber"
                        />
                    </div>

                    {/* Salary & Payroll Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-slate-900)",
                                border: "1px solid var(--color-slate-800)",
                            }}
                        >
                            <h3
                                className="text-lg font-bold mb-4"
                                style={{ color: "var(--color-white)" }}
                            >
                                💰 Salary Overview
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span style={{ color: "var(--color-slate-400)" }}>
                                        Average Monthly
                                    </span>
                                    <span
                                        className="font-bold"
                                        style={{ color: "var(--color-teal-400)" }}
                                    >
                                        {formatCurrency(analytics.salary.averageMonthly)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span style={{ color: "var(--color-slate-400)" }}>
                                        Total Monthly Payroll
                                    </span>
                                    <span
                                        className="font-bold"
                                        style={{ color: "var(--color-emerald-400)" }}
                                    >
                                        {formatCurrency(analytics.salary.totalMonthly)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span style={{ color: "var(--color-slate-400)" }}>
                                        Salary Range
                                    </span>
                                    <span
                                        className="font-bold"
                                        style={{ color: "var(--color-slate-300)" }}
                                    >
                                        {formatCurrency(analytics.salary.minSalary)} -{" "}
                                        {formatCurrency(analytics.salary.maxSalary)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-slate-900)",
                                border: "1px solid var(--color-slate-800)",
                            }}
                        >
                            <h3
                                className="text-lg font-bold mb-4"
                                style={{ color: "var(--color-white)" }}
                            >
                                📊 Leave Statistics
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-black"
                                        style={{ color: "var(--color-amber-400)" }}
                                    >
                                        {analytics.leaves.pending}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: "var(--color-slate-500)" }}
                                    >
                                        Pending
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-black"
                                        style={{ color: "var(--color-emerald-400)" }}
                                    >
                                        {analytics.leaves.approved}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: "var(--color-slate-500)" }}
                                    >
                                        Approved
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-black"
                                        style={{ color: "var(--color-red-400)" }}
                                    >
                                        {analytics.leaves.rejected}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: "var(--color-slate-500)" }}
                                    >
                                        Rejected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Departments */}
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            backgroundColor: "var(--color-slate-900)",
                            border: "1px solid var(--color-slate-800)",
                        }}
                    >
                        <h3
                            className="text-lg font-bold mb-4"
                            style={{ color: "var(--color-white)" }}
                        >
                            🏢 Employees by Department
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {analytics.departments.map((dept, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl text-center"
                                    style={{
                                        backgroundColor: "var(--color-slate-800)",
                                    }}
                                >
                                    <div
                                        className="text-2xl font-black"
                                        style={{ color: "var(--color-teal-400)" }}
                                    >
                                        {dept.count}
                                    </div>
                                    <div
                                        className="text-xs mt-1 truncate"
                                        style={{ color: "var(--color-slate-400)" }}
                                    >
                                        {dept.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Report Tab */}
            {activeTab === "attendance" && (
                <div className="space-y-6">
                    {/* Date Filter */}
                    <div
                        className="flex flex-wrap gap-4 p-4 rounded-xl"
                        style={{ backgroundColor: "var(--color-slate-900)" }}
                    >
                        <div>
                            <label
                                className="block text-xs mb-1"
                                style={{ color: "var(--color-slate-400)" }}
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{
                                    backgroundColor: "var(--color-slate-800)",
                                    color: "var(--color-white)",
                                    border: "1px solid var(--color-slate-700)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs mb-1"
                                style={{ color: "var(--color-slate-400)" }}
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) =>
                                    setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{
                                    backgroundColor: "var(--color-slate-800)",
                                    color: "var(--color-white)",
                                    border: "1px solid var(--color-slate-700)",
                                }}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={fetchAttendanceReport}
                                className="px-6 py-2 rounded-lg text-sm font-semibold"
                                style={{
                                    backgroundColor: "var(--color-teal-500)",
                                    color: "var(--color-white)",
                                }}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            backgroundColor: "var(--color-slate-900)",
                            border: "1px solid var(--color-slate-800)",
                        }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ backgroundColor: "var(--color-slate-800)" }}>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Employee
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Department
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Date
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Check In
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Check Out
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Hours
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceReport.length > 0 ? (
                                        attendanceReport.map((record, idx) => (
                                            <tr
                                                key={record.id}
                                                style={{
                                                    borderBottom: "1px solid var(--color-slate-800)",
                                                    backgroundColor:
                                                        idx % 2 === 0
                                                            ? "transparent"
                                                            : "var(--color-slate-800/30)",
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div
                                                        className="font-medium"
                                                        style={{ color: "var(--color-white)" }}
                                                    >
                                                        {record.employeeName}
                                                    </div>
                                                    <div
                                                        className="text-xs"
                                                        style={{ color: "var(--color-slate-500)" }}
                                                    >
                                                        {record.employeeId}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm"
                                                    style={{ color: "var(--color-slate-300)" }}
                                                >
                                                    {record.department || "—"}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm"
                                                    style={{ color: "var(--color-slate-300)" }}
                                                >
                                                    {formatDate(record.date)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm"
                                                    style={{ color: "var(--color-emerald-400)" }}
                                                >
                                                    {formatTime(record.checkIn)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm"
                                                    style={{ color: "var(--color-amber-400)" }}
                                                >
                                                    {record.checkOut ? formatTime(record.checkOut) : "—"}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm font-medium"
                                                    style={{ color: "var(--color-teal-400)" }}
                                                >
                                                    {record.workHours?.toFixed(1) || "—"}h
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                                                        style={{
                                                            backgroundColor:
                                                                record.status === "present"
                                                                    ? "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)"
                                                                    : record.status === "late"
                                                                        ? "color-mix(in srgb, var(--color-amber-500) 20%, transparent)"
                                                                        : "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
                                                            color:
                                                                record.status === "present"
                                                                    ? "var(--color-emerald-400)"
                                                                    : record.status === "late"
                                                                        ? "var(--color-amber-400)"
                                                                        : "var(--color-red-400)",
                                                        }}
                                                    >
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12 text-center"
                                                style={{ color: "var(--color-slate-500)" }}
                                            >
                                                No attendance records found for the selected date range
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Salary Slips Tab */}
            {activeTab === "salary" && (
                <div className="space-y-6">
                    {/* Salary Table */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            backgroundColor: "var(--color-slate-900)",
                            border: "1px solid var(--color-slate-800)",
                        }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ backgroundColor: "var(--color-slate-800)" }}>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Employee
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Department
                                        </th>
                                        <th
                                            className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Basic
                                        </th>
                                        <th
                                            className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            HRA
                                        </th>
                                        <th
                                            className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Gross
                                        </th>
                                        <th
                                            className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Deductions
                                        </th>
                                        <th
                                            className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "var(--color-slate-400)" }}
                                        >
                                            Net Salary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaryReport.length > 0 ? (
                                        salaryReport.map((slip, idx) => (
                                            <tr
                                                key={slip.id}
                                                style={{
                                                    borderBottom: "1px solid var(--color-slate-800)",
                                                    backgroundColor:
                                                        idx % 2 === 0
                                                            ? "transparent"
                                                            : "var(--color-slate-800/30)",
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div
                                                        className="font-medium"
                                                        style={{ color: "var(--color-white)" }}
                                                    >
                                                        {slip.employeeName}
                                                    </div>
                                                    <div
                                                        className="text-xs"
                                                        style={{ color: "var(--color-slate-500)" }}
                                                    >
                                                        {slip.employeeId}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm"
                                                    style={{ color: "var(--color-slate-300)" }}
                                                >
                                                    {slip.department || "—"}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-right"
                                                    style={{ color: "var(--color-slate-300)" }}
                                                >
                                                    {formatCurrency(slip.basic)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-right"
                                                    style={{ color: "var(--color-slate-300)" }}
                                                >
                                                    {formatCurrency(slip.hra)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-right font-medium"
                                                    style={{ color: "var(--color-emerald-400)" }}
                                                >
                                                    {formatCurrency(slip.grossEarnings)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-right"
                                                    style={{ color: "var(--color-red-400)" }}
                                                >
                                                    -{formatCurrency(slip.totalDeductions)}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm text-right font-bold"
                                                    style={{ color: "var(--color-teal-400)" }}
                                                >
                                                    {formatCurrency(slip.monthlyWage)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12 text-center"
                                                style={{ color: "var(--color-slate-500)" }}
                                            >
                                                No salary records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
    color,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    color: "teal" | "emerald" | "red" | "amber";
}) {
    const colors = {
        teal: {
            bg: "color-mix(in srgb, var(--color-teal-500) 15%, transparent)",
            border: "color-mix(in srgb, var(--color-teal-500) 30%, transparent)",
            text: "var(--color-teal-400)",
        },
        emerald: {
            bg: "color-mix(in srgb, var(--color-emerald-500) 15%, transparent)",
            border: "color-mix(in srgb, var(--color-emerald-500) 30%, transparent)",
            text: "var(--color-emerald-400)",
        },
        red: {
            bg: "color-mix(in srgb, var(--color-red-500) 15%, transparent)",
            border: "color-mix(in srgb, var(--color-red-500) 30%, transparent)",
            text: "var(--color-red-400)",
        },
        amber: {
            bg: "color-mix(in srgb, var(--color-amber-500) 15%, transparent)",
            border: "color-mix(in srgb, var(--color-amber-500) 30%, transparent)",
            text: "var(--color-amber-400)",
        },
    };

    const c = colors[color];

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                backgroundColor: "var(--color-slate-900)",
                border: "1px solid var(--color-slate-800)",
            }}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-slate-400)" }}
                    >
                        {title}
                    </p>
                    <p className="text-3xl font-black mt-2" style={{ color: c.text }}>
                        {value}
                    </p>
                    {subtitle && (
                        <p
                            className="text-xs mt-1"
                            style={{ color: "var(--color-slate-500)" }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-xl"
                    style={{
                        backgroundColor: c.bg,
                        border: `1px solid ${c.border}`,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
