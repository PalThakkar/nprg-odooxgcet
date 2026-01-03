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
    // Calculate work hours
    const durationMs = checkOutTime.getTime() - new Date(existingAttendance.checkIn).getTime();
    
    // Enforce 1 hour minimum duration (3600000 ms)
    if (durationMs < 3600000) {
        return NextResponse.json({ 
            error: 'Minimum work duration is 1 hour. Please try again later.' 
        }, { status: 400 });
    }

    const workHours = durationMs / (1000 * 60 * 60);

    // Fetch company settings for Half-day logic
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true }
    });

    let status = 'present';
    if (user?.company) {
        const standardHours = user.company.workHours || 9; // Default fallback
        if (workHours < (standardHours / 2)) {
            status = 'half-day';
        } else {
             // If not half-day, keep existing status (which might be Late) or default to present
             // We need to fetch the existing status first? 'existingAttendance' has it.
             status = existingAttendance.status === 'late' ? 'late' : 'present';
        }
    } else {
        // Fallback default logic
        if (workHours < 4) {
            status = 'half-day';
        } else {
             status = existingAttendance.status === 'late' ? 'late' : 'present';
        }
    }

    // Update attendance record
    const attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
            checkOut: checkOutTime,
            workHours: parseFloat(workHours.toFixed(2)),
            status: status
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
