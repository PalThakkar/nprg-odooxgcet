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
      }
    } catch (error) {
      console.error("Check-in failed:", error);
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
      }
    } catch (error) {
      console.error("Check-out failed:", error);
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
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(to bottom right, var(--color-slate-950), var(--color-slate-900), var(--color-slate-950))`,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-white)" }}>
            Attendance
          </h1>
          <p style={{ color: "var(--color-slate-400)" }}>
            Track your daily attendance and work hours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/20 group"
              style={{
                background: `linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))`,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Clock size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-slate-400)" }}>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-5xl font-black tabular-nums tracking-tight" style={{ color: "var(--color-white)" }}>
                      {todayStatus === 'checked-in' ? timer : new Date().toLocaleTimeString('en-US', { hour12: false })}
                    </h2>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${todayStatus === 'checked-in'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    : todayStatus === 'checked-out'
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                    {todayStatus === 'not-checked-in' ? 'Not Checked In' : todayStatus.replace('-', ' ')}
                  </div>
                </div>

                <div className="flex gap-4">
                  {todayStatus === 'not-checked-in' && (
                    <button
                      onClick={handleCheckIn}
                      disabled={processing}
                      className="flex-1 h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95"
                      style={{
                        background: `linear-gradient(to right, var(--color-emerald-500), var(--color-teal-500))`,
                        color: "white",
                        boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)"
                      }}
                    >
                      {processing ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
                      Check In
                    </button>
                  )}

                  {todayStatus === 'checked-in' && (
                    <button
                      onClick={handleCheckOut}
                      disabled={processing || (!!checkInTime && new Date().getTime() - new Date(checkInTime).getTime() < 3600000)}
                      className={`flex-1 h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
                        ${(checkInTime && new Date().getTime() - new Date(checkInTime).getTime() < 3600000)
                          ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30'
                        }`}
                    >
                      {processing ? (
                        <Loader2 className="animate-spin" />
                      ) : (checkInTime && new Date().getTime() - new Date(checkInTime).getTime() < 3600000) ? (
                        <>
                          <Clock className="w-5 h-5" />
                          <span>
                            Wait {Math.ceil((3600000 - (new Date().getTime() - new Date(checkInTime).getTime())) / 60000)}m
                          </span>
                        </>
                      ) : (
                        <>
                          <Square fill="currentColor" />
                          <span>Check Out</span>
                        </>
                      )}
                    </button>
                  )}

                  {todayStatus === 'checked-out' && (
                    <div className="flex-1 h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-slate-800/50 text-slate-400 border border-slate-700">
                      <Coffee />
                      Dictionary day completed!
                    </div>
                  )}
                </div>

                {todayStatus !== 'not-checked-in' && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Check In Time</p>
                      <p className="text-xl font-bold text-white">
                        {checkInTime ? new Date(checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Check Out Time</p>
                      <p className="text-xl font-bold text-white">
                        {checkOutTime ? new Date(checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance List */}
            <div className="rounded-3xl p-6 border border-slate-800 bg-slate-900/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {attendances.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No attendance records found.</p>
                ) : (
                  attendances.map((record) => (
                    <div key={record.id} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                            ${record.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' :
                            record.status === 'half-day' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {new Date(record.date).getDate()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">
                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short' })}
                          </p>
                          <p className="text-xs text-slate-500">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            {' - '}
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Thinking...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold uppercase tracking-wider
                            ${record.status === 'present' ? 'text-emerald-500' :
                            record.status === 'half-day' ? 'text-amber-500' : 'text-slate-500'}`}>
                          {record.status}
                        </p>
                        {record.workHours && (
                          <p className="text-xs text-slate-500 mt-1">
                            {record.workHours.toFixed(1)} hrs
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
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-2xl font-black text-emerald-500">
                    {stats.present}
                  </p>
                  <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-wider mt-1">Present</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-2xl font-black text-amber-500">
                    {stats.halfDay}
                  </p>
                  <p className="text-xs font-semibold text-amber-400/60 uppercase tracking-wider mt-1">Late/Half</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                  <p className="text-2xl font-black text-rose-500">{stats.absent}</p>
                  <p className="text-xs font-semibold text-rose-400/60 uppercase tracking-wider mt-1">Absent</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-2xl font-black text-blue-500">{stats.leaves}</p>
                  <p className="text-xs font-semibold text-blue-400/60 uppercase tracking-wider mt-1">Leaves</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Office Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Headquarters</p>
                    <p className="text-xs text-slate-500">Unit 301, Tech Park, Gujarat</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Working Hours</p>
                    <p className="text-xs text-slate-500">09:00 AM - 06:00 PM</p>
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
