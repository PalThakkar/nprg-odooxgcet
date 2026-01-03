import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headerList = await headers();
    const companyId = headerList.get('x-user-company-id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in session' }, { status: 400 });
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            loginId: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leaves);
  } catch (error: any) {
    console.error('Fetch leaves error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
