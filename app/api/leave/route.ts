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
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    // Build filter based on role
    let userFilter: any = {};
    if (userRole === 'admin' || userRole === 'hr') {
        if (employeeId) {
            userFilter.userId = employeeId;
        }
    } else {
        // Employees can only see their own leave requests
        userFilter.userId = userId;
    }

    let statusFilter: any = {};
    if (status) {
        statusFilter.status = status;
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
        where: {
            ...userFilter,
            ...statusFilter,
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
            createdAt: 'desc',
        },
    });

    return NextResponse.json({ leaveRequests });
}

export async function POST(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, leaveType, reason } = await request.json();

    if (!startDate || !endDate || !leaveType) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
        return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 });
    }

    // Calculate leave days
    const leaveDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Get user's leave balance
    const leaveBalance = await prisma.leaveBalance.findUnique({
        where: { userId },
    });

    if (!leaveBalance) {
        return NextResponse.json({ error: 'Leave balance not found' }, { status: 404 });
    }

    // Check if enough leave days are available
    let availableDays = 0;
    switch (leaveType) {
        case 'paid':
            availableDays = leaveBalance.paidDaysLeft;
            break;
        case 'sick':
            availableDays = leaveBalance.sickDaysLeft;
            break;
        case 'unpaid':
            availableDays = leaveBalance.unpaidDaysLeft;
            break;
        default:
            return NextResponse.json({ error: 'Invalid leave type' }, { status: 400 });
    }

    if (availableDays < leaveDays) {
        return NextResponse.json({ error: 'Insufficient leave balance' }, { status: 400 });
    }

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
        data: {
            userId,
            startDate: start,
            endDate: end,
            leaveType,
            reason,
            status: 'pending',
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
    });

    return NextResponse.json({ leaveRequest }, { status: 201 });
}
