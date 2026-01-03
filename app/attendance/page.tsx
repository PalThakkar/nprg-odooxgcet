'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Clock, Calendar, User, LogOut, CheckCircle, XCircle } from 'lucide-react';

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
      const data = await apiClient.getTodayAttendance();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dayflow HRMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h2>
          <p className="text-gray-600">Mark your attendance for today</p>
        </div>

        {/* Current Time Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              {formatDate(currentTime)}
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{user?.name}</span>
              {user?.employeeId && (
                <span className="text-gray-500">({user.employeeId})</span>
              )}
            </div>

            {/* Attendance Status */}
            {attendance && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <span className="ml-2 font-medium">
                      {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not checked in'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <span className="ml-2 font-medium">
                      {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not checked out'}
                    </span>
                  </div>
                  {attendance.workHours && (
                    <div>
                      <span className="text-gray-600">Work Hours:</span>
                      <span className="ml-2 font-medium">{attendance.workHours.toFixed(1)}h</span>
                    </div>
                  )}
                  {attendance.extraHours && attendance.extraHours > 0 && (
                    <div>
                      <span className="text-gray-600">Extra Hours:</span>
                      <span className="ml-2 font-medium">{attendance.extraHours.toFixed(1)}h</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!isCheckedIn && !isCheckedOut && (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>{actionLoading ? 'Checking in...' : 'Check In'}</span>
                </button>
              )}
              
              {isCheckedIn && (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  <span>{actionLoading ? 'Checking out...' : 'Check Out'}</span>
                </button>
              )}
              
              {isCheckedOut && (
                <div className="text-gray-500">
                  <p className="font-medium">Attendance completed for today</p>
                  <p className="text-sm">Come back tomorrow!</p>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes('Successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Attendance History</h3>
            </div>
            <p className="text-gray-600 mb-4">View your attendance records and summaries</p>
            <a
              href="/attendance/history"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              View History →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Leave Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Apply for leave or check your leave balance</p>
            <a
              href="/leave"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              Manage Leave →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
