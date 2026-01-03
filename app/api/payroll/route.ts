import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const payPeriod = searchParams.get('payPeriod');
    const employeeId = searchParams.get('employeeId');

    // Build filter based on role
    let userFilter: any = {};
    if (userRole === 'admin' || userRole === 'hr') {
        if (employeeId) {
            userFilter.userId = employeeId;
        }
    } else {
        // Employees can only see their own payroll
        userFilter.userId = userId;
    }

    let periodFilter: any = {};
    if (payPeriod) {
        periodFilter.payPeriod = payPeriod;
    }

    const payrolls = await prisma.payroll.findMany({
        where: {
            ...userFilter,
            ...periodFilter,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                },
            },
        },
        orderBy: {
            payPeriod: 'desc',
        },
    });

    return NextResponse.json({ payrolls });
}

export async function POST(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId || (userRole !== 'admin' && userRole !== 'hr')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
        userId: targetUserId, 
        basicSalary, 
        allowances = 0, 
        deductions = 0, 
        payPeriod 
    } = await request.json();

    if (!targetUserId || !basicSalary || !payPeriod) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const netSalary = basicSalary + allowances - deductions;

    // Check if payroll already exists for this period and user
    const existingPayroll = await prisma.payroll.findFirst({
        where: {
            userId: targetUserId,
            payPeriod,
        },
    });

    if (existingPayroll) {
        return NextResponse.json({ error: 'Payroll already exists for this period' }, { status: 400 });
    }

    const payroll = await prisma.payroll.create({
        data: {
            userId: targetUserId,
            basicSalary,
            allowances,
            deductions,
            netSalary,
            payPeriod,
            status: 'draft',
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                },
            },
        },
    });

    return NextResponse.json({ payroll }, { status: 201 });
}
