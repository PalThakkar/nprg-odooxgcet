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

    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
            name: true,
            initials: true,
            startTime: true,
            workHours: true,
            gracePeriod: true
        }
    });

    if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);

  } catch (error: any) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const headerList = await headers();
        const companyId = headerList.get('x-user-company-id');
        const userRole = headerList.get('x-user-role');
    
        if (!companyId || userRole?.toLowerCase() !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { startTime, workHours, gracePeriod } = body;

        // Validation
        if (!startTime || !workHours || gracePeriod === undefined) {
             return NextResponse.json({ error: 'Missing required permissions' }, { status: 400 });
        }

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: {
                startTime,
                workHours: parseFloat(workHours),
                gracePeriod: parseInt(gracePeriod)
            }
        });

        return NextResponse.json(updatedCompany);

    } catch (error: any) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
