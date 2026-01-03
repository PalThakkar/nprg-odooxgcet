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

    const employees = await prisma.user.findMany({
      where: { companyId },
      include: {
        role: { select: { name: true } }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Fetch employees error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
