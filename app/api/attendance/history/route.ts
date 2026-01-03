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
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const employeeId = searchParams.get('employeeId');

    // Build date filter
    let dateFilter: any = {};
    if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        dateFilter = {
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
    }

    // Build user filter based on role
    let userFilter: any = {};
    if (userRole === 'admin' || userRole === 'hr') {
        if (employeeId) {
            userFilter.userId = employeeId;
        }
    } else {
        // Employees can only see their own attendance
        userFilter.userId = userId;
    }

    const attendances = await prisma.attendance.findMany({
        where: {
            ...userFilter,
            ...dateFilter,
        },
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
        orderBy: {
            date: 'desc',
        },
    });

    // Calculate summary statistics
    const summary = {
        totalDays: attendances.length,
        presentDays: attendances.filter(a => a.status === 'present').length,
        absentDays: attendances.filter(a => a.status === 'absent').length,
        halfDays: attendances.filter(a => a.status === 'half-day').length,
        leaveDays: attendances.filter(a => a.status === 'leave').length,
        totalWorkHours: attendances.reduce((sum, a) => sum + (a.workHours || 0), 0),
        totalExtraHours: attendances.reduce((sum, a) => sum + (a.extraHours || 0), 0),
    };

    return NextResponse.json({
        attendances,
        summary,
    });
}
