import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [leaves, balance] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.leaveBalance.findUnique({
        where: { userId }
      })
    ]);

    return NextResponse.json({ requests: leaves, balance });
  } catch (error: any) {
    console.error('Fetch user leaves error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const companyId = headersList.get('x-user-company-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate, type, reason } = await request.json();

    if (!startDate || !endDate || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLeave = await prisma.leaveRequest.create({
      data: {
        userId,
        companyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
        status: 'PENDING'
      }
    });

    return NextResponse.json(newLeave, { status: 201 });
  } catch (error: any) {
    console.error('Create leave error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
