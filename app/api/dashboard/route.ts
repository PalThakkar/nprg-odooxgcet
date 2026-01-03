import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    // Build filter based on role
    let targetUserId = userId;
    if ((userRole === 'admin' || userRole === 'hr') && employeeId) {
        targetUserId = employeeId;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    try {
        // Get user profile
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                name: true,
                email: true,
                employeeId: true,
                jobTitle: true,
                department: true,
                status: true,
                avatarUrl: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get attendance summary for current month
        const attendances = await prisma.attendance.findMany({
            where: {
                userId: targetUserId,
                date: {
                    gte: monthStart,
                    lte: monthEnd,
                },
            },
        });

        const attendanceSummary = {
            totalDays: attendances.length,
            presentDays: attendances.filter(a => a.status === 'present').length,
            absentDays: attendances.filter(a => a.status === 'absent').length,
            halfDays: attendances.filter(a => a.status === 'half-day').length,
            leaveDays: attendances.filter(a => a.status === 'leave').length,
            totalWorkHours: attendances.reduce((sum, a) => sum + (a.workHours || 0), 0),
            totalExtraHours: attendances.reduce((sum, a) => sum + (a.extraHours || 0), 0),
        };

        // Get leave balance
        const leaveBalance = await prisma.leaveBalance.findUnique({
            where: { userId: targetUserId },
        });

        const defaultLeaveBalance = {
            paidDaysLeft: 24,
            sickDaysLeft: 7,
            unpaidDaysLeft: 0,
        };

        // Get recent leave requests
        const recentLeaveRequests = await prisma.leaveRequest.findMany({
            where: { userId: targetUserId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        employeeId: true,
                    },
                },
            },
        });

        // Get recent payroll
        const recentPayroll = await prisma.payroll.findMany({
            where: { userId: targetUserId },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        // Admin/HR specific data
        let adminData: {
            totalEmployees: number;
            pendingLeaveRequests: number;
            todayAttendances: number;
            presentToday: number;
            absentToday: number;
        } | undefined = undefined;
        if (userRole === 'admin' || userRole === 'hr') {
            const [totalEmployees, pendingLeaveRequests, todayAttendances] = await Promise.all([
                prisma.user.count(),
                prisma.leaveRequest.count({ where: { status: 'pending' } }),
                prisma.attendance.count({
                    where: {
                        date: {
                            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                            lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                        },
                    },
                }),
            ]);

            const presentToday = await prisma.attendance.count({
                where: {
                    date: {
                        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                        lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                    },
                    status: 'present',
                },
            });

            adminData = {
                totalEmployees,
                pendingLeaveRequests,
                todayAttendances,
                presentToday,
                absentToday: todayAttendances - presentToday,
            };
        }

        return NextResponse.json({
            user,
            attendanceSummary,
            leaveBalance: leaveBalance || defaultLeaveBalance,
            recentLeaveRequests,
            recentPayroll,
            adminData,
        });

    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
