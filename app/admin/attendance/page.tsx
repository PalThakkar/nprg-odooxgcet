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
        <div className="min-h-screen bg-transparent relative z-10 p-4 md:p-8 font-mono">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
                <div className="border-l-8 border-primary pl-6 py-2">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
                        Daily Attendance
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
                        Monitor checks and statux
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 border-2 border-slate-700 p-2 shadow-[4px_4px_0px_0px_var(--color-slate-800)] hover:border-primary transition-colors">
                    <CalendarIcon className="w-5 h-5 text-primary ml-2" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white border-none focus:outline-none focus:ring-0 font-bold uppercase"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="p-6 bg-slate-900 border-2 border-slate-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1">
                    <p className="text-sm font-black uppercase tracking-widest mb-2 text-slate-400">Total Workforce</p>
                    <p className="text-4xl font-black text-white">{stats.total || 0}</p>
                </div>

                <div className="p-6 bg-emerald-900/10 border-2 border-emerald-500 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.3)] transition-transform hover:-translate-y-1">
                    <p className="text-sm font-black uppercase tracking-widest mb-2 text-emerald-500">Present</p>
                    <p className="text-4xl font-black text-white">{stats.present || 0}</p>
                </div>

                <div className="p-6 bg-rose-900/10 border-2 border-rose-500 shadow-[8px_8px_0px_0px_rgba(244,63,94,0.3)] transition-transform hover:-translate-y-1">
                    <p className="text-sm font-black uppercase tracking-widest mb-2 text-rose-500">Absent</p>
                    <p className="text-4xl font-black text-white">{stats.absent || 0}</p>
                </div>

                <div className="p-6 bg-amber-900/10 border-2 border-amber-500 shadow-[8px_8px_0px_0px_rgba(245,158,11,0.3)] transition-transform hover:-translate-y-1">
                    <p className="text-sm font-black uppercase tracking-widest mb-2 text-amber-500">Leave / Late</p>
                    <p className="text-4xl font-black text-white">{(stats.halfDay || 0) + (stats.onLeave || 0)}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="brutal-card p-0 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b-2 border-slate-800 bg-slate-900 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border-2 border-slate-700 py-2 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary font-bold uppercase text-sm"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border-2 font-bold uppercase text-xs transition-colors
                                ${showFilters
                                    ? 'bg-slate-800 text-white border-white'
                                    : 'bg-slate-950 text-slate-400 border-slate-700 hover:border-primary hover:text-primary'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-2 border-slate-700 text-slate-400 font-bold uppercase text-xs hover:border-primary hover:text-primary transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-6 border-b-2 border-slate-800 bg-slate-950">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="bg-slate-900 border-2 border-slate-700 px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="">ALL STATUSES</option>
                                    <option value="checked-in">CHECKED IN</option>
                                    <option value="checked-out">CHECKED OUT</option>
                                    <option value="absent">ABSENT</option>
                                    <option value="on-leave">ON LEAVE</option>
                                    <option value="half-day">HALF DAY</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Department</label>
                                <input
                                    type="text"
                                    placeholder="ENTER DEPT..."
                                    value={filters.department}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                    className="bg-slate-900 border-2 border-slate-700 px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-primary uppercase"
                                />
                            </div>
                            <button
                                onClick={() => setFilters({ status: "", department: "" })}
                                className="px-4 py-2 bg-slate-800 text-slate-400 font-bold uppercase text-xs border-2 border-slate-700 hover:border-white hover:text-white transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Table/Grid */}
                <div className="overflow-x-auto bg-slate-900">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-800 bg-slate-950/50">
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Employee</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Check In</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Check Out</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Hours</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="font-bold uppercase tracking-widest text-slate-500">Fetching data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center font-bold uppercase tracking-widest text-slate-500">
                                        No attendance records match your filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.user.id} className="group hover:bg-slate-800 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    {item.user.avatarUrl ? (
                                                        <img src={item.user.avatarUrl} alt={item.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-slate-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm uppercase group-hover:text-primary transition-colors">{item.user.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.user.department || 'NO DEPT'} • {item.user.jobTitle || 'NO TITLE'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 border-2 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
                                                ${item.status === 'checked-in' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500' :
                                                    item.status === 'checked-out' ? 'bg-blue-900/20 border-blue-500 text-blue-500' :
                                                        item.status === 'absent' ? 'bg-rose-900/20 border-rose-500 text-rose-500' :
                                                            'bg-amber-900/20 border-amber-500 text-amber-500'
                                                }`}>
                                                <span className={`w-2 h-2 ${item.status === 'checked-in' ? 'bg-emerald-500 animate-pulse' :
                                                    item.status === 'checked-out' ? 'bg-blue-500' :
                                                        item.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                                                    }`} />
                                                {item.status.replace('-', ' ')}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 font-mono font-bold text-slate-300">
                                                {item.attendance?.checkIn ? (
                                                    <>
                                                        <Clock className="w-3 h-3 text-emerald-500" />
                                                        {new Date(item.attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-600">--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 font-mono font-bold text-slate-300">
                                                {item.attendance?.checkOut ? (
                                                    <>
                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                        {new Date(item.attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-600">--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {item.attendance?.workHours ? (
                                                <span className="font-black text-white">{item.attendance.workHours.toFixed(2)} HRS</span>
                                            ) : (
                                                <span className="text-slate-600 font-bold">--</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" />
                                                HQ
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
