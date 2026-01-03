import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for testing without database
    const mockData = {
        user: {
            id: userId,
            name: "Test User",
            email: "test@example.com",
            employeeId: "EMP001",
            jobTitle: "Software Engineer",
            department: "Engineering",
            status: "present",
            avatarUrl: null,
        },
        attendanceSummary: {
            totalDays: 22,
            presentDays: 20,
            absentDays: 1,
            halfDays: 1,
            leaveDays: 0,
            totalWorkHours: 160,
            totalExtraHours: 2,
        },
        leaveBalance: {
            paidDaysLeft: 24,
            sickDaysLeft: 7,
            unpaidDaysLeft: 0,
        },
        recentLeaveRequests: [],
        recentPayroll: [],
        adminData: userRole === 'admin' ? {
            totalEmployees: 25,
            pendingLeaveRequests: 3,
            todayAttendances: 20,
            presentToday: 18,
            absentToday: 2,
        } : undefined,
    };

    return NextResponse.json(mockData);
}
