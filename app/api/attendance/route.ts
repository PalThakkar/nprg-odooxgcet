import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const headerList = await headers();
    const userId = headerList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    // Construct start and end dates carefully to respect timezones/local usage roughly
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const attendances = await prisma.attendance.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    // Check if checked in today
    // 1. Check for any active (open) session first
    const activeAttendance = await prisma.attendance.findFirst({
        where: {
            userId,
            checkOut: null
        }
    });

    // 2. If no active session, check if we already completed today
    let todayAttendance = activeAttendance;
    
    if (!activeAttendance) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        todayAttendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            orderBy: { checkIn: 'desc' }
        });
    }

    let todayStatus = 'not-checked-in';
    if (activeAttendance) {
        todayStatus = 'checked-in';
    } else if (todayAttendance?.checkOut) {
        todayStatus = 'checked-out';
    }

    // Fetch approved leaves for this month
    const leaves = await prisma.leaveRequest.findMany({
        where: {
            userId,
            status: 'APPROVED',
            OR: [
                {
                    startDate: { gte: startDate, lte: endDate }
                },
                {
                    endDate: { gte: startDate, lte: endDate }
                }
            ]
        }
    });

    // Calculate stats
    // 1. Get total days in month passed so far (or total in month if historical)
    const now = new Date();
    const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;
    const daysInMonth = isCurrentMonth ? now.getDate() : new Date(year, month + 1, 0).getDate();
    
    // Simple working day calculation (excluding Sundays) - simplified for now
    let workingDaysPassed = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        if (d.getDay() !== 0) { // Exclude Sundays
            workingDaysPassed++;
        }
    }

    const presentDays = attendances.filter(a => a.status === 'present').length;
    const halfDays = attendances.filter(a => a.status === 'half-day' || a.status === 'late').length;
    const leaveDays = leaves.length; // Simplified: assumes 1 request = 1 day or similar. Ideally should sum duration.

    // Absent = Working Days Passed - (Present + Half Days + Leaves)
    // Ensure doesn't go below 0
    const totalAttended = presentDays + halfDays + leaveDays;
    const absentDays = Math.max(0, workingDaysPassed - totalAttended);

    const stats = {
        present: presentDays,
        halfDay: halfDays,
        leaves: leaveDays,
        absent: absentDays
    };

    return NextResponse.json({ 
        attendances,
        leaves,
        stats,
        todayStatus,
        checkInTime: todayAttendance?.checkIn,
        checkOutTime: todayAttendance?.checkOut,
        workHours: todayAttendance?.workHours
    });

  } catch (error: any) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
