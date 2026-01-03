'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Clock, Calendar, User, LogOut, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AttendanceData {
  id?: string;
  checkIn?: string;
  checkOut?: string;
  date: string;
  workHours?: number;
  extraHours?: number;
  status: string;
}

export default function AttendancePage() {
  const { user, logout } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = (await apiClient.getTodayAttendance()) as any;
      setAttendance(data.attendance as AttendanceData);
    } catch (error: any) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      await apiClient.checkIn();
      await fetchAttendance();
      setMessage('Successfully checked in!');
    } catch (error: any) {
      setMessage(error.message || 'Failed to check in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      await apiClient.checkOut();
      await fetchAttendance();
      setMessage('Successfully checked out!');
    } catch (error: any) {
      setMessage(error.message || 'Failed to check out');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isCheckedIn = attendance?.checkIn && !attendance?.checkOut;
  const isCheckedOut = attendance?.checkOut;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white font-black uppercase tracking-widest text-xl">Loading System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="bg-slate-900 border-b-2 border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary border-2 border-white mr-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"></div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Dayflow HRMS</h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {user?.name} <span className="text-primary">///</span> {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-red-500 font-bold uppercase transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter drop-shadow-[4px_4px_0px_var(--color-slate-800)]">Attendance Control</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Synchronize your work status</p>
        </div>

        {/* Current Time Card */}
        <div className="brutal-card bg-slate-900 p-8 mb-12 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-primary)]">
          <div className="text-center">
            <div className="inline-block px-6 py-2 border-2 border-primary bg-primary/10 mb-6">
              <div className="text-6xl font-black text-primary tracking-tighter tabular-nums">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-8">
              {formatDate(currentTime)}
            </div>

            <div className="flex items-center justify-center space-x-3 mb-8 bg-slate-950 w-fit mx-auto px-4 py-2 border border-slate-800">
              <User className="h-4 w-4 text-slate-500" />
              <span className="text-white font-bold uppercase">{user?.name}</span>
              {user?.employeeId && (
                <span className="text-slate-600 font-mono text-sm">[{user.employeeId}]</span>
              )}
            </div>

            {/* Attendance Status */}
            {attendance && (
              <div className="mb-8 p-6 bg-slate-950 border-2 border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Check-in</span>
                    <span className={`text-xl font-bold font-mono ${attendance.checkIn ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '--:--'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Check-out</span>
                    <span className={`text-xl font-bold font-mono ${attendance.checkOut ? 'text-blue-500' : 'text-slate-600'}`}>
                      {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '--:--'}
                    </span>
                  </div>
                  {attendance.workHours && (
                    <div className="col-span-full border-t border-slate-800 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Total Work Hours</span>
                        <span className="text-xl font-bold font-mono text-white">{attendance.workHours.toFixed(2)} HRS</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6">
              {!isCheckedIn && !isCheckedOut && (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="group relative px-8 py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider border-2 border-emerald-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6" />
                    <span>{actionLoading ? 'Processing...' : 'Check In Now'}</span>
                  </div>
                </button>
              )}

              {isCheckedIn && (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="group relative px-8 py-4 bg-red-500 text-white font-black uppercase tracking-wider border-2 border-red-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <XCircle className="h-6 w-6" />
                    <span>{actionLoading ? 'Processing...' : 'Check Out Now'}</span>
                  </div>
                </button>
              )}

              {isCheckedOut && (
                <div className="text-slate-500 py-4 px-6 border-2 border-slate-800 bg-slate-900/50">
                  <p className="font-black uppercase tracking-widest text-lg text-white">Day Complete</p>
                  <p className="text-sm font-bold mt-1">See you tomorrow!</p>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mt-6 p-4 border-2 font-bold uppercase tracking-wide text-sm ${message.includes('Successfully')
                ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500'
                : 'bg-red-900/20 border-red-500 text-red-500'
                }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/employees/attendance" className="group block bg-slate-900 p-6 border-2 border-slate-800 hover:border-blue-500 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-blue-500)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-slate-950 border border-slate-800 group-hover:border-blue-500 transition-colors">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="ml-4 text-xl font-black text-white uppercase italic">History</h3>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-6 h-10">View your full attendance records and summaries</p>
            <div className="flex items-center text-blue-500 font-bold uppercase text-sm group-hover:underline decoration-2 underline-offset-4">
              View History <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Link>

          <Link href="/employees/time-off" className="group block bg-slate-900 p-6 border-2 border-slate-800 hover:border-emerald-500 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-emerald-500)]">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-slate-950 border border-slate-800 group-hover:border-emerald-500 transition-colors">
                <Clock className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="ml-4 text-xl font-black text-white uppercase italic">Leaves</h3>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-6 h-10">Apply for time off or check your leave balance</p>
            <div className="flex items-center text-emerald-500 font-bold uppercase text-sm group-hover:underline decoration-2 underline-offset-4">
              Manage Leave <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
