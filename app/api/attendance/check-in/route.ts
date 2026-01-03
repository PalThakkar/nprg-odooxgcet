import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    const userId = headerList.get('x-user-id');
    const companyId = headerList.get('x-user-company-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already checked in for today
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
            }
        }
    });

    if (existingAttendance) {
        return NextResponse.json({ error: 'Already checked in for today' }, { status: 400 });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
        data: {
            userId,
            checkIn: new Date(),
            status: 'present',
            date: new Date()
        }
    });

    // Update user status
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'present' }
    });

    return NextResponse.json(attendance);

  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
