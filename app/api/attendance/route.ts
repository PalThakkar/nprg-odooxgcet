import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
        where: {
            userId,
            date: today,
        },
        orderBy: {
            checkIn: 'desc',
        },
    });

    return NextResponse.json({ attendance });
}

export async function POST(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (action === 'check-in') {
        // Check if already checked in today
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: today,
                checkOut: null,
            },
        });

        if (existingAttendance) {
            return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
        }

        const newAttendance = await prisma.attendance.create({
            data: {
                userId,
                date: today,
                checkIn: new Date(),
                status: 'present',
            },
        });

        // Update user status
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'present' },
        });

        return NextResponse.json({ attendance: newAttendance });
    } else if (action === 'check-out') {
        const currentAttendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: today,
                checkOut: null,
            },
            orderBy: {
                checkIn: 'desc',
            },
        });

        if (!currentAttendance) {
            return NextResponse.json({ error: 'No active check-in found' }, { status: 400 });
        }

        const checkOutTime = new Date();
        const checkInTime = new Date(currentAttendance.checkIn);
        const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // Convert to hours
        
        // Calculate extra hours (after 8 hours)
        const extraHours = workHours > 8 ? workHours - 8 : 0;

        const updatedAttendance = await prisma.attendance.update({
            where: { id: currentAttendance.id },
            data: {
                checkOut: checkOutTime,
                workHours: parseFloat(workHours.toFixed(2)),
                extraHours: parseFloat(extraHours.toFixed(2)),
            },
        });

        // Update user status
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'absent' },
        });

        return NextResponse.json({ attendance: updatedAttendance });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
