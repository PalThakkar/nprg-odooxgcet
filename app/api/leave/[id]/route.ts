import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId || (userRole !== 'admin' && userRole !== 'hr')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, remarks } = await request.json();

    if (!status || !['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { id: leaveId } = await params;

    // Get the leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id: leaveId },
        include: { user: true },
    });

    if (!leaveRequest) {
        return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leaveRequest.status !== 'pending') {
        return NextResponse.json({ error: 'Leave request already processed' }, { status: 400 });
    }

    // Update leave request
    const updatedLeaveRequest = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: {
            status,
            approvedBy: userId,
            approvedAt: new Date(),
            remarks,
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

    // If approved, update leave balance
    if (status === 'approved') {
        const leaveDays = Math.ceil(
            (new Date(leaveRequest.endDate).getTime() - new Date(leaveRequest.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
        ) + 1;

        await prisma.leaveBalance.update({
            where: { userId: leaveRequest.userId },
            data: {
                [leaveRequest.leaveType === 'paid' ? 'paidDaysLeft' :
                 leaveRequest.leaveType === 'sick' ? 'sickDaysLeft' : 'unpaidDaysLeft']:
                {
                    decrement: leaveDays,
                },
            },
        });
    }

    return NextResponse.json({ leaveRequest: updatedLeaveRequest });
}
