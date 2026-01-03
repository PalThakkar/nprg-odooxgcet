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

    let leaveBalance = await prisma.leaveBalance.findUnique({
        where: { userId: targetUserId },
    });

    // Create leave balance if it doesn't exist
    if (!leaveBalance) {
        leaveBalance = await prisma.leaveBalance.create({
            data: {
                userId: targetUserId,
                year: new Date().getFullYear(),
            },
        });
    }

    return NextResponse.json({ leaveBalance });
}
