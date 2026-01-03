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

    const filteredData = data.filter(item =>
        item.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-950">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Employee Attendance</h1>
                    <p className="text-slate-400">Monitor daily check-ins and workforce status</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                    <CalendarIcon className="w-5 h-5 text-slate-400 ml-2" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white border-none focus:ring-0 font-medium"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Employees</p>
                    <p className="text-4xl font-black text-white">{stats.total || 0}</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-2">Present Today</p>
                    <p className="text-4xl font-black text-emerald-500">{stats.present || 0}</p>
                </div>
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <p className="text-sm font-medium text-rose-400 uppercase tracking-wider mb-2">Absent</p>
                    <p className="text-4xl font-black text-rose-500">{stats.absent || 0}</p>
                </div>
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-2">On Leave / Late</p>
                    <p className="text-4xl font-black text-amber-500">{(stats.halfDay || 0) + (stats.onLeave || 0)}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">

                {/* Toolbar */}
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Table/Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                        <p className="text-slate-400">Loading attendance data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50">
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Work Hours</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No employees found matching your search.
                                        </td>
                                    </tr>
                                ) : filteredData.map((item) => (
                                    <tr key={item.user.id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                                                    {item.user.avatarUrl ? (
                                                        <img src={item.user.avatarUrl} alt={item.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-teal-400 transition-colors">{item.user.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{item.user.jobTitle || 'No Title'} • {item.user.department || 'No Dept'}</p>
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
                                            <div className="flex items-center gap-2 text-slate-300 font-medium">
                                                {item.attendance?.checkIn ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-emerald-500" />
                                                        {new Date(item.attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-600">--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-300 font-medium">
                                                {item.attendance?.checkOut ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-blue-500" />
                                                        {new Date(item.attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-600">--:--</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {item.attendance?.workHours ? (
                                                <span className="font-bold text-white">{item.attendance.workHours.toFixed(2)} hrs</span>
                                            ) : (
                                                <span className="text-slate-600">--</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs">
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
