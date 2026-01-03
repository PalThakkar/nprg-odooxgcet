import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const headerList = await headers();
    const companyId = headerList.get('x-user-company-id');

    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    
    // Set target date - normalize to local string if possible or UTC
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch all users in the company
    const users = await prisma.user.findMany({
        where: { 
            companyId,
            role: {
                name: { not: 'ADMIN' }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            jobTitle: true,
            department: true,
            avatarUrl: true
        }
    });

    // Fetch attendance for these users on the target date
    const attendances = await prisma.attendance.findMany({
        where: {
            userId: { in: users.map(u => u.id) },
            date: {
                gte: targetDate,
                lt: nextDay
            }
        }
    });

    // Fetch leave requests for these users that cover the target date
    const leaves = await prisma.leaveRequest.findMany({
        where: {
            userId: { in: users.map(u => u.id) },
            status: 'APPROVED',
            startDate: { lte: targetDate },
            endDate: { gte: targetDate }
        }
    });

    // Merge data
    const attendanceMap = new Map();
    attendances.forEach(a => attendanceMap.set(a.userId, a));

    const leaveMap = new Map();
    leaves.forEach(l => leaveMap.set(l.userId, l));

    const result = users.map(user => {
        const attendance = attendanceMap.get(user.id);
        const leave = leaveMap.get(user.id);
        
        let status = 'absent';
        
        if (attendance) {
            status = 'present'; 
            if (attendance.checkOut) {
                status = 'checked-out';
            } else {
                status = 'checked-in';
            }
            if (attendance.status === 'half-day') status = 'half-day';
        } else if (leave) {
            status = 'on-leave';
        }
        
        return {
            user,
            attendance: attendance || null,
            status
        };
    });

    const stats = {
        total: users.length,
        present: result.filter(r => ['checked-in', 'checked-out', 'present'].includes(r.status)).length,
        absent: result.filter(r => r.status === 'absent').length,
        halfDay: result.filter(r => r.status === 'half-day').length,
        onLeave: result.filter(r => r.status === 'on-leave').length,
    };

    return NextResponse.json({ 
        date: targetDate, 
        data: result, 
        stats 
    });

  } catch (error: any) {
    console.error('Admin attendance fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
