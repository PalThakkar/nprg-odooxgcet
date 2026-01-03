"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, AlertCircle, DollarSign, FileText } from "lucide-react";

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
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <div className="font-black uppercase text-xl text-white tracking-widest">Generating Insights...</div>
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
                        Analytics & Reports
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
                        Data-driven insights
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-8">
                {["overview", "attendance", "salary"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`px-8 py-3 text-sm font-black uppercase tracking-wider border-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]
                            ${activeTab === tab
                                ? "bg-primary border-primary text-slate-950"
                                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-white hover:text-white"
                            }`}
                    >
                        {tab === "salary" ? "Payroll" : tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && analytics && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Employees"
                            value={analytics.overview.totalEmployees.toString()}
                            icon={<Users className="w-6 h-6" />}
                            color="teal"
                        />
                        <StatCard
                            title="Present Today"
                            value={analytics.overview.presentToday.toString()}
                            subtitle={`${analytics.overview.attendanceRate}% Rate`}
                            icon={<TrendingUp className="w-6 h-6" />}
                            color="emerald"
                        />
                        <StatCard
                            title="Absent Today"
                            value={analytics.overview.absentToday.toString()}
                            icon={<TrendingDown className="w-6 h-6" />}
                            color="red"
                        />
                        <StatCard
                            title="Pending Leaves"
                            value={analytics.leaves.pending.toString()}
                            subtitle={`${analytics.leaves.total} Total`}
                            icon={<AlertCircle className="w-6 h-6" />}
                            color="amber"
                        />
                    </div>

                    {/* Salary & Payroll Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="brutal-card bg-slate-900 p-6 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
                            <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-primary" />
                                Salary Overview
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Average Monthly</span>
                                    <span className="font-black text-primary text-lg">{formatCurrency(analytics.salary.averageMonthly)}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Total Payroll</span>
                                    <span className="font-black text-emerald-500 text-lg">{formatCurrency(analytics.salary.totalMonthly)}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800">
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Salary Range</span>
                                    <span className="font-bold text-white text-sm">
                                        {formatCurrency(analytics.salary.minSalary)} - {formatCurrency(analytics.salary.maxSalary)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="brutal-card bg-slate-900 p-6 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
                            <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-amber-500" />
                                Leave Statistics
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 group hover:border-amber-500 transition-colors">
                                    <div className="text-4xl font-black text-amber-500 mb-2">{analytics.leaves.pending}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-amber-500">Pending</div>
                                </div>
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 group hover:border-emerald-500 transition-colors">
                                    <div className="text-4xl font-black text-emerald-500 mb-2">{analytics.leaves.approved}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500">Approved</div>
                                </div>
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 group hover:border-red-500 transition-colors">
                                    <div className="text-4xl font-black text-red-500 mb-2">{analytics.leaves.rejected}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-500">Rejected</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Departments */}
                    <div className="brutal-card bg-slate-900 p-6 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
                        <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-500" />
                            Workforce Distribution
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {analytics.departments.map((dept, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-950 border border-slate-800 text-center hover:border-blue-500 transition-colors group"
                                >
                                    <div className="text-3xl font-black text-white group-hover:text-blue-500 mb-2">{dept.count}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate" title={dept.name}>
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
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Date Filter */}
                    <div className="flex flex-wrap gap-4 p-6 bg-slate-900 border-2 border-slate-800 shadow-[4px_4px_0px_0px_var(--color-slate-800)] items-end">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                                className="px-4 py-2 bg-slate-950 border-2 border-slate-700 text-white font-bold text-sm focus:border-primary focus:outline-none uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">End Date</label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                                className="px-4 py-2 bg-slate-950 border-2 border-slate-700 text-white font-bold text-sm focus:border-primary focus:outline-none uppercase"
                            />
                        </div>
                        <button
                            onClick={fetchAttendanceReport}
                            className="px-6 py-2 bg-primary text-slate-950 font-black uppercase text-sm border-2 border-primary hover:bg-teal-400 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Attendance Table */}
                    <div className="brutal-card p-0 overflow-hidden bg-slate-900 border-2 border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-800 bg-slate-950/50">
                                        {["Employee", "Department", "Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                                            <th key={h} className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-800">
                                    {attendanceReport.length > 0 ? (
                                        attendanceReport.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white uppercase">{record.employeeName}</div>
                                                    <div className="text-[10px] font-mono text-slate-500">{record.employeeId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{record.department || "—"}</td>
                                                <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{formatDate(record.date)}</td>
                                                <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-500">{formatTime(record.checkIn)}</td>
                                                <td className="px-6 py-4 text-xs font-mono font-bold text-amber-500">{record.checkOut ? formatTime(record.checkOut) : "—"}</td>
                                                <td className="px-6 py-4 text-xs font-mono font-bold text-white">{record.workHours?.toFixed(1) || "—"}H</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-[10px] font-black uppercase border tracking-widest
                                                        ${record.status === 'present' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' :
                                                            record.status === 'late' ? 'bg-amber-900/20 border-amber-500 text-amber-500' :
                                                                'bg-red-900/20 border-red-500 text-red-500'}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest">
                                                No records found for range
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
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="brutal-card p-0 overflow-hidden bg-slate-900 border-2 border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-800 bg-slate-950/50">
                                        {["Employee", "Department", "Basic", "HRA", "Gross", "Deductions", "Net Salary"].map((h) => (
                                            <th key={h} className={`px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 ${h === "Employee" || h === "Department" ? "text-left" : "text-right"}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-800">
                                    {salaryReport.length > 0 ? (
                                        salaryReport.map((slip) => (
                                            <tr key={slip.id} className="hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white uppercase">{slip.employeeName}</div>
                                                    <div className="text-[10px] font-mono text-slate-500">{slip.employeeId}</div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold uppercase text-slate-400">{slip.department || "—"}</td>
                                                <td className="px-6 py-4 text-xs font-mono text-right text-slate-400">{formatCurrency(slip.basic)}</td>
                                                <td className="px-6 py-4 text-xs font-mono text-right text-slate-400">{formatCurrency(slip.hra)}</td>
                                                <td className="px-6 py-4 text-xs font-mono text-right font-bold text-emerald-500">{formatCurrency(slip.grossEarnings)}</td>
                                                <td className="px-6 py-4 text-xs font-mono text-right text-red-500">-{formatCurrency(slip.totalDeductions)}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-right font-black text-white">{formatCurrency(slip.monthlyWage)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest">
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
    icon: React.ReactNode;
    color: "teal" | "emerald" | "red" | "amber";
}) {
    const config = {
        teal: "border-teal-500 text-teal-500 bg-teal-500/10",
        emerald: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
        red: "border-red-500 text-red-500 bg-red-500/10",
        amber: "border-amber-500 text-amber-500 bg-amber-500/10",
    };

    return (
        <div className={`p-6 bg-slate-900 border-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${config[color].replace('text-', 'border-').split(' ')[0]} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
            <div className="flex justify-between items-start mb-4">
                <p className={`text-xs font-black uppercase tracking-widest ${config[color].split(' ')[1]}`}>
                    {title}
                </p>
                <div className={`p-2 border-2 bg-slate-950 ${config[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter mb-1">
                {value}
            </div>
            {subtitle && (
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
