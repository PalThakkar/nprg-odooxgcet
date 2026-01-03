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
    
    // Create UTC range that encompasses the entire local day
    // Assuming backend might be UTC but users are +05:30.
    // If dateParam is "2026-01-03", we want 2026-01-02T18:30:00Z to 2026-01-03T18:29:59Z
    // But simplistic approach: Query 00:00 to 23:59 in LOCAL time logic if possible, OR
    // Just parse `new Date(dateParam)` which gives UTC 00:00.
    
    let startOfDay, endOfDay;

    if (dateParam) {
        // e.g. "2026-01-03"
        // Force parsing as local day start if we assume server is handling local dates?
        // Actually, if we use just strings it is safer for Prisma if it uses ISO strings.
        
        // Let's use string manipulation for range to avoid Timezone offset mess
        // This effectively queries for "Starts on this calendar date in UTC"
        // Which might still be wrong if user is in +05:30...
        
        // Let's assume the user wants to see records that happened on that calendar date *in their timezone*.
        // But we don't know the timezone easily without client sending it.
        // Fallback: Use UTC day.
        
        const d = new Date(dateParam);
        d.setUTCHours(0,0,0,0);
        startOfDay = d;
        
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        endOfDay = next;
    } else {
        const d = new Date();
        d.setHours(0,0,0,0); // Local start of day
        startOfDay = d;
        
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        endOfDay = next;
    }

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
                gte: startOfDay,
                lt: endOfDay
            }
        }
    });

    // Fetch leave requests for these users that cover the target date
    const leaves = await prisma.leaveRequest.findMany({
        where: {
            userId: { in: users.map(u => u.id) },
            status: 'APPROVED',
            startDate: { lte: startOfDay },
            endDate: { gte: startOfDay }
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
            if (attendance.status === 'late') status = 'late';
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
        halfDay: result.filter(r => ['half-day', 'late'].includes(r.status)).length,
        onLeave: result.filter(r => r.status === 'on-leave').length,
    };

    return NextResponse.json({ 
        date: startOfDay, 
        data: result, 
        stats 
    });

  } catch (error: any) {
    console.error('Admin attendance fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
