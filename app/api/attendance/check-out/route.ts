import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const userId = headerList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
        where: {
            userId,
            date: {
                gte: today,
                lt: tomorrow
            },
            checkOut: null // Only if not already checked out
        }
    });

    if (!existingAttendance) {
        return NextResponse.json({ error: 'No active check-in found for today' }, { status: 404 });
    }

    const checkOutTime = new Date();
    const workHours = (checkOutTime.getTime() - new Date(existingAttendance.checkIn).getTime()) / (1000 * 60 * 60);

    // Update attendance record
    const attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
            checkOut: checkOutTime,
            workHours,
            status: workHours < 4 ? 'half-day' : 'present' // Simple logic: < 4 hours is half-day
        }
    });

    // Update user status
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'absent' }
    });

    return NextResponse.json(attendance);

  } catch (error: any) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
