import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log("Check-out API hit");
    const headerList = await headers();
    const userId = headerList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find ALL active (open) sessions
    const activeAttendances = await prisma.attendance.findMany({
        where: {
            userId,
            checkOut: null
        }
    });

    if (activeAttendances.length === 0) {
        return NextResponse.json({ error: 'No active check-in found' }, { status: 400 });
    }

    const checkOutTime = new Date();
    let lastProcessedAttendance = null;

    // Fetch user company settings once
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true }
    });

    // Process ALL open sessions
    for (const attendanceRecord of activeAttendances) {
        const durationMs = checkOutTime.getTime() - new Date(attendanceRecord.checkIn).getTime();
        
        // Validation: If it's the MOST RECENT session, enforce minimum duration?
        // Actually, for stale sessions (yesterday), duration will be huge, which is fine.
        // For today's session, if it's < 1 min, we might want to block?
        // But if we block, we leave the stale ones open? 
        // Better to just check them all out. If one is too short, we maybe just mark it but don't error?
        // Or if the *shortest* one is too short, we error?
        // Let's stick to the relaxed 1 minute rule for the *current* session. 
        // We'll assume the "current" one is the one with the latest checkIn time.
        
        // But simply closing them all is robust. Let's just calculate logic for each.

        const workHours = durationMs / (1000 * 60 * 60);
        
        let status = 'present';
        if (user?.company) {
            const standardHours = user.company.workHours || 9;
            if (workHours < (standardHours / 2)) {
                status = 'half-day';
            } else {
                 status = attendanceRecord.status === 'late' ? 'late' : 'present';
            }
        } else {
            if (workHours < 4) {
                status = 'half-day';
            } else {
                 status = attendanceRecord.status === 'late' ? 'late' : 'present';
            }
        }

        // Update record
        const updated = await prisma.attendance.update({
            where: { id: attendanceRecord.id },
            data: {
                checkOut: checkOutTime,
                workHours: parseFloat(workHours.toFixed(2)),
                status: status
            }
        });
        lastProcessedAttendance = updated;
    }

    // Update user status
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'absent' }
    });

    return NextResponse.json(lastProcessedAttendance);

  } catch (error: any) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
