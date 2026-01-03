'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  UserX,
  Briefcase,
  LogOut
} from 'lucide-react';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    employeeId?: string;
    jobTitle?: string;
    department?: string;
    status: string;
    avatarUrl?: string;
  };
  attendanceSummary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    halfDays: number;
    leaveDays: number;
    totalWorkHours: number;
    totalExtraHours: number;
  };
  leaveBalance: {
    paidDaysLeft: number;
    sickDaysLeft: number;
    unpaidDaysLeft: number;
  };
  recentLeaveRequests: any[];
  recentPayroll: any[];
  adminData?: {
    totalEmployees: number;
    pendingLeaveRequests: number;
    todayAttendances: number;
    presentToday: number;
    absentToday: number;
  };
}

export default function DashboardPage() {
  const { user, logout, isAdmin, isHR, isEmployee } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.getDashboardData();
      setDashboardData(data as DashboardData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Failed to load dashboard data'}</p>
        </div>
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
                {dashboardData.user.name} ({user?.role})
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your HRMS today.
          </p>
        </div>

        {/* Admin/HR Stats */}
        {(isAdmin || isHR) && dashboardData.adminData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.adminData.totalEmployees}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Leave Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.adminData.pendingLeaveRequests}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.adminData.presentToday}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Absent Today</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.adminData.absentToday}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present Days</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.attendanceSummary.presentDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Work Hours</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.attendanceSummary.totalWorkHours.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Leave Days</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.leaveBalance.paidDaysLeft}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Extra Hours</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.attendanceSummary.totalExtraHours.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isEmployee && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance</h3>
                <div className="space-y-2">
                  <a href="/attendance" className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Mark Attendance
                  </a>
                  <a href="/attendance/history" className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                    View History
                  </a>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Management</h3>
                <div className="space-y-2">
                  <a href="/leave/apply" className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Apply for Leave
                  </a>
                  <a href="/leave" className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                    My Leave Requests
                  </a>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
                <div className="space-y-2">
                  <a href="/profile" className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                    Edit Profile
                  </a>
                  <a href="/payroll" className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                    View Payroll
                  </a>
                </div>
              </div>
            </>
          )}
          
          {(isAdmin || isHR) && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Management</h3>
                <div className="space-y-2">
                  <a href="/employees" className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Manage Employees
                  </a>
                  <a href="/employees/add" className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Add Employee
                  </a>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Management</h3>
                <div className="space-y-2">
                  <a href="/leave/pending" className="block w-full text-center bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700">
                    Pending Requests ({dashboardData.adminData?.pendingLeaveRequests || 0})
                  </a>
                  <a href="/leave" className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                    All Leave Requests
                  </a>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll</h3>
                <div className="space-y-2">
                  <a href="/payroll/create" className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                    Create Payroll
                  </a>
                  <a href="/payroll" className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                    View Payroll
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
