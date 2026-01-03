import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import EmployeeGrid from '@/components/EmployeeGrid';
import { EmployeeStats } from '@/components/EmployeeStats';

async function getEmployees() {
  try {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        loginId: true,
        status: true,
        phone: true,

        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return employees;
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return [];
  }
}

async function getEmployeeStats() {
  try {
    const [totalEmployees, activeEmployees] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      totalDepartments: 5, // Mock data for now
      avgSalary: 75000, // Mock data for now
    };
  } catch (error) {
    console.error('Failed to fetch employee stats:', error);
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      totalDepartments: 0,
      avgSalary: 0,
    };
  }
}

export default async function EmployeesPage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  // Authentication check
  if (!userId || (userRole !== 'admin' && userRole !== 'hr')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Server-side data fetching
  const [employees, stats] = await Promise.all([
    getEmployees(),
    getEmployeeStats(),
  ]);

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
                {userRole} Dashboard
              </span>
              <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600 mt-2">Manage your organization's employees</p>
        </div>

        {/* Stats Cards */}
        <EmployeeStats stats={stats} />

        {/* Employee Grid */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">All Employees</h3>
            <a
              href="/employees/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Employee
            </a>
          </div>

          <EmployeeGrid initialEmployees={employees} />
        </div>
      </main>
    </div>
  );
}
