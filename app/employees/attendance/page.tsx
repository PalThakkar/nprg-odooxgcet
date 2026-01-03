"use client";

import { useState, useEffect } from "react";
import { Loader2, Play, Square, Calendar, Clock, MapPin, Coffee } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
  status: string;
}

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ present: 0, halfDay: 0, absent: 0, leaves: 0 });
  const [todayStatus, setTodayStatus] = useState<'not-checked-in' | 'checked-in' | 'checked-out'>('not-checked-in');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [workHours, setWorkHours] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [timer, setTimer] = useState<string>("00:00:00");

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (todayStatus === 'checked-in' && checkInTime) {
      interval = setInterval(() => {
        const start = new Date(checkInTime).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [todayStatus, checkInTime]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/attendance", { cache: "no-store", headers: { 'Pragma': 'no-cache' } });
      const data = await res.json();

      if (res.ok) {
        setAttendances(data.attendances || []);
        if (data.stats) setStats(data.stats);
        setTodayStatus(data.todayStatus);
        setCheckInTime(data.checkInTime);
        setCheckOutTime(data.checkOutTime);
        setWorkHours(data.workHours);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      if (res.ok) {
        await fetchAttendance();
      } else {
        const data = await res.json();
        alert(data.error || 'Check-in failed');
      }
    } catch (error) {
      console.error("Check-in failed:", error);
      alert('An error occurred during check-in');
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      if (res.ok) {
        await fetchAttendance();
      } else {
        const data = await res.json();
        alert(data.error || 'Check-out failed');
      }
    } catch (error) {
      console.error("Check-out failed:", error);
      alert('An error occurred during check-out');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-950 font-mono relative overflow-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-slate-800)_1px,transparent_1px),linear-gradient(90deg,var(--color-slate-800)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="border-l-8 border-primary pl-6 py-2">
          <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
            Attendance
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            Track your daily attendance and work hours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative border-2 border-primary bg-slate-900 p-8 shadow-[8px_8px_0px_0px_var(--color-primary)] overflow-hidden group">

              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Clock size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2 text-primary">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-6xl font-black tabular-nums tracking-tighter text-white">
                      {todayStatus === 'checked-in' ? timer : new Date().toLocaleTimeString('en-US', { hour12: false })}
                    </h2>
                  </div>
                  <div className={`px-4 py-2 text-sm font-black uppercase tracking-widest border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${todayStatus === 'checked-in'
                    ? 'bg-emerald-500 border-emerald-700 text-slate-900 shadow-emerald-900'
                    : todayStatus === 'checked-out'
                      ? 'bg-blue-500 border-blue-700 text-slate-900 shadow-blue-900'
                      : 'bg-slate-800 border-slate-600 text-slate-400 shadow-slate-950'
                    }`}>
                    {todayStatus === 'not-checked-in' ? 'NOT CHECKED IN' : todayStatus.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="flex gap-4">
                  {todayStatus === 'not-checked-in' && (
                    <button
                      onClick={handleCheckIn}
                      disabled={processing}
                      className="flex-1 h-20 font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 bg-primary text-slate-950 border-2 border-primary shadow-[6px_6px_0px_0px_var(--color-white)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-white)]"
                    >
                      {processing ? <Loader2 className="animate-spin w-6 h-6" /> : <Play fill="currentColor" className="w-6 h-6" />}
                      Check In
                    </button>
                  )}

                  {todayStatus === 'checked-in' && (
                    <button
                      onClick={handleCheckOut}
                      disabled={processing || (!!checkInTime && new Date().getTime() - new Date(checkInTime!).getTime() < 3600000)}
                      className={`flex-1 h-20 font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 border-2 transition-all
                        ${(checkInTime && new Date().getTime() - new Date(checkInTime!).getTime() < 3600000)
                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-75'
                          : 'bg-red-500 text-white border-red-500 shadow-[6px_6px_0px_0px_var(--color-white)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-white)] active:bg-red-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                        }`}
                    >
                      {processing ? (
                        <Loader2 className="animate-spin w-6 h-6" />
                      ) : (checkInTime && new Date().getTime() - new Date(checkInTime!).getTime() < 3600000) ? (
                        <>
                          <Clock className="w-6 h-6" />
                          <span>
                            Wait {Math.ceil((3600000 - (new Date().getTime() - new Date(checkInTime!).getTime())) / 60000)}m
                          </span>
                        </>
                      ) : (
                        <>
                          <Square fill="currentColor" className="w-6 h-6" />
                          <span>Check Out</span>
                        </>
                      )}
                    </button>
                  )}

                  {todayStatus === 'checked-out' && (
                    <div className="flex-1 h-20 font-bold text-lg flex items-center justify-center gap-3 bg-slate-800 text-slate-400 border-2 border-slate-700">
                      <Coffee className="w-6 h-6" />
                      WORK DAY COMPLETED
                    </div>
                  )}
                </div>

                {todayStatus !== 'not-checked-in' && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 border-2 border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Check In Time</p>
                      <p className="text-2xl font-black text-white">
                        {checkInTime ? new Date(checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-4 border-2 border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Check Out Time</p>
                      <p className="text-2xl font-black text-white">
                        {checkOutTime ? new Date(checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance List */}
            <div className="border-2 border-slate-800 bg-slate-900 p-6 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
                <Calendar className="w-6 h-6 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {attendances.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 font-bold uppercase">No attendance records found.</p>
                ) : (
                  attendances.map((record) => (
                    <div key={record.id} className="group flex items-center justify-between p-4 bg-slate-950 border-2 border-slate-800 hover:border-primary transition-colors hover:shadow-[4px_4px_0px_0px_var(--color-primary)] hover:-translate-y-1 duration-200">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center font-black text-xl border-2
                            ${record.status === 'present' ? 'bg-emerald-500 text-slate-900 border-emerald-500' :
                            record.status === 'half-day' ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-rose-500 text-slate-900 border-rose-500'}`}>
                          {new Date(record.date).getDate()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 uppercase">
                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short' })}
                          </p>
                          <p className="text-xs text-slate-500 font-mono font-bold">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            {' - '}
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black uppercase tracking-wider
                            ${record.status === 'present' ? 'text-emerald-500' :
                            record.status === 'half-day' ? 'text-amber-500' : 'text-slate-500'}`}>
                          {record.status}
                        </p>
                        {record.workHours && (
                          <p className="text-xs text-slate-500 mt-1 font-mono font-bold">
                            {record.workHours.toFixed(1)} HRS
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border-2 border-emerald-500/30 hover:border-emerald-500 transition-colors">
                  <p className="text-3xl font-black text-emerald-500">
                    {stats.present}
                  </p>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Present</p>
                </div>
                <div className="p-4 bg-slate-950 border-2 border-amber-500/30 hover:border-amber-500 transition-colors">
                  <p className="text-3xl font-black text-amber-500">
                    {stats.halfDay}
                  </p>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Late/Half</p>
                </div>
                <div className="p-4 bg-slate-950 border-2 border-rose-500/30 hover:border-rose-500 transition-colors">
                  <p className="text-3xl font-black text-rose-500">{stats.absent}</p>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mt-1">Absent</p>
                </div>
                <div className="p-4 bg-slate-950 border-2 border-blue-500/30 hover:border-blue-500 transition-colors">
                  <p className="text-3xl font-black text-blue-500">{stats.leaves}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">Leaves</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Office Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-800 border-2 border-slate-700">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300 uppercase">Headquarters</p>
                    <p className="text-xs text-slate-500 font-bold mt-1">Unit 301, Tech Park, Gujarat</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-800 border-2 border-slate-700">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300 uppercase">Working Hours</p>
                    <p className="text-xs text-slate-500 font-bold mt-1">09:00 AM - 06:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
