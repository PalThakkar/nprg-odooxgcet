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
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAttendance = await prisma.attendance.findFirst({
        where: {
            userId,
            date: {
                gte: today,
                lt: tomorrow
            }
        },
        orderBy: { checkIn: 'desc' }
    });

    let todayStatus = 'not-checked-in';
    if (todayAttendance) {
        if (!todayAttendance.checkOut) {
            todayStatus = 'checked-in';
        } else {
             todayStatus = 'checked-out';
        }
    }

    return NextResponse.json({ 
        attendances,
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
