"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar as CalendarIcon, Search, Filter, Download, User, Clock, MapPin } from "lucide-react";

interface EmployeeAttendance {
    user: {
        id: string;
        name: string;
        email: string;
        employeeId: string;
        jobTitle: string;
        department: string;
        avatarUrl: string | null;
    };
    attendance: {
        id: string;
        checkIn: string;
        checkOut: string | null;
        workHours: number | null;
        status: string;
    } | null;
    status: string;
}

export default function AdminAttendancePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<EmployeeAttendance[]>([]);
    const [stats, setStats] = useState<any>({});
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
        department: ""
    });

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/attendance?date=${selectedDate}`);
            const json = await res.json();
            if (res.ok) {
                setData(json.data);
                setStats(json.stats);
            }
        } catch (error) {
            console.error("Failed to fetch admin attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ["Employee ID", "Name", "Email", "Department", "Job Title", "Status", "Check In", "Check Out", "Work Hours"],
            ...filteredData.map(item => [
                item.user.employeeId || "",
                item.user.name || "",
                item.user.email || "",
                item.user.department || "",
                item.user.jobTitle || "",
                item.status,
                item.attendance?.checkIn ? new Date(item.attendance.checkIn).toLocaleString() : "",
                item.attendance?.checkOut ? new Date(item.attendance.checkOut).toLocaleString() : "",
                item.attendance?.workHours?.toString() || ""
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance-${selectedDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredData = data.filter(item => {
        const matchesSearch = item.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || item.status === filters.status;
        const matchesDepartment = !filters.department || item.user.department?.toLowerCase().includes(filters.department.toLowerCase());
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    return (
        <div className="min-h-screen text-foreground">
            <div className="home-bg"></div>

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Employee Attendance</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Monitor daily check-ins and workforce status</p>
                </div>
                <div className="flex items-center gap-3 card-gradient p-2 rounded-xl border border-border/50">
                    <CalendarIcon className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-foreground border-none focus:ring-0 font-medium"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
                <div className="p-6 rounded-3xl card-gradient border border-border/50">
                    <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Total Employees</p>
                    <p className="text-4xl font-black" style={{ color: "var(--foreground)" }}>{stats.total || 0}</p>
                </div>
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-2">Present Today</p>
                    <p className="text-4xl font-black text-emerald-500">{stats.present || 0}</p>
                </div>
                <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20">
                    <p className="text-sm font-medium text-rose-400 uppercase tracking-wider mb-2">Absent</p>
                    <p className="text-4xl font-black text-rose-500">{stats.absent || 0}</p>
                </div>
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-2">On Leave / Late</p>
                    <p className="text-4xl font-black text-amber-500">{(stats.halfDay || 0) + (stats.onLeave || 0)}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="card-gradient rounded-3xl border border-border/50 overflow-hidden backdrop-blur-sm mx-8 mb-8 mt-8">

                {/* Toolbar */}
                <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-6 border-b border-border bg-card/20">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="checked-out">Checked Out</option>
                                    <option value="absent">Absent</option>
                                    <option value="on-leave">On Leave</option>
                                    <option value="half-day">Half Day</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Department</label>
                                <input
                                    type="text"
                                    placeholder="Enter department..."
                                    value={filters.department}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                    className="bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ status: "", department: "" })}
                                    className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table/Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--primary)" }} />
                        <p style={{ color: "var(--muted-foreground)" }}>Loading attendance data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-card/50">
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Employee</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Status</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Check In</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Check Out</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Work Hours</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                                            No employees found matching your search.
                                        </td>
                                    </tr>
                                ) : filteredData.map((item) => (
                                    <tr key={item.user.id} className="hover:bg-card/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center overflow-hidden border border-border">
                                                    {item.user.avatarUrl ? (
                                                        <img src={item.user.avatarUrl} alt={item.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold group-hover:text-primary transition-colors" style={{ color: "var(--foreground)" }}>{item.user.name || 'Unknown'}</p>
                                                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.user.jobTitle || 'No Title'} • {item.user.department || 'No Dept'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                                        ${item.status === 'checked-in' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                    item.status === 'checked-out' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                        item.status === 'absent' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                                            'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${item.status === 'checked-in' ? 'bg-emerald-500 animate-pulse' :
                                                        item.status === 'checked-out' ? 'bg-blue-500' :
                                                            item.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                                                    }`} />
                                                {item.status.replace('-', ' ')}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 font-medium" style={{ color: "var(--foreground)" }}>
                                                {item.attendance?.checkIn ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-emerald-500" />
                                                        {new Date(item.attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span style={{ color: "var(--muted-foreground)" }}>--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 font-medium" style={{ color: "var(--foreground)" }}>
                                                {item.attendance?.checkOut ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-blue-500" />
                                                        {new Date(item.attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span style={{ color: "var(--muted-foreground)" }}>--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {item.attendance?.workHours ? (
                                                <span className="font-bold" style={{ color: "var(--foreground)" }}>{item.attendance.workHours.toFixed(2)} hrs</span>
                                            ) : (
                                                <span style={{ color: "var(--muted-foreground)" }}>--</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                <MapPin className="w-3 h-3" />
                                                Office (HQ)
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
