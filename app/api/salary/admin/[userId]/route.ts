import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { calculateSalaryComponents } from '@/lib/salary-utils';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const headerList = await headers();
    const companyId = headerList.get('x-user-company-id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in session' }, { status: 400 });
    }

    const salaryInfo = await prisma.salaryInfo.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            loginId: true,
            phone: true,
            companyId: true
          }
        }
      }
    });

    if (salaryInfo && salaryInfo.user.companyId !== companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(salaryInfo || { message: 'No salary info found for this user' });
  } catch (error: any) {
    console.error('Fetch salary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { monthlyWage, workingDays, workingHours } = await req.json();
    const headerList = await headers();
    const companyId = headerList.get('x-user-company-id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in session' }, { status: 400 });
    }

    // Verify company access
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true }
    });

    if (!userToUpdate || userToUpdate.companyId !== companyId) {
      return NextResponse.json({ error: 'User not found or unauthorized' }, { status: 404 });
    }

    const components = calculateSalaryComponents(monthlyWage);
    const yearlyWage = monthlyWage * 12;

    const salaryInfo = await prisma.salaryInfo.upsert({
      where: { userId },
      update: {
        monthlyWage,
        yearlyWage,
        workingDays,
        workingHours,
        ...components
      },
      create: {
        userId,
        monthlyWage,
        yearlyWage,
        workingDays,
        workingHours,
        ...components
      }
    });

    return NextResponse.json(salaryInfo);
  } catch (error: any) {
    console.error('Update salary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
