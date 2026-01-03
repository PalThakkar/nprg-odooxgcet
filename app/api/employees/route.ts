import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId || (userRole !== 'admin' && userRole !== 'hr')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const department = searchParams.get('department');

    const skip = (page - 1) * limit;

    // Get current user's company ID
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
    });

    if (!currentUser?.companyId) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Build filters
    let whereClause: any = {
        companyId: currentUser.companyId,
    };

    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { employeeId: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (department) {
        whereClause.department = department;
    }

    const [employees, total] = await Promise.all([
        prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                employeeId: true,
                jobTitle: true,
                department: true,
                status: true,
                dateJoined: true,
                phone: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.user.count({
            where: whereClause,
        }),
    ]);

    return NextResponse.json({
        employees,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

export async function POST(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId || (userRole !== 'admin' && userRole !== 'hr')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
        name, 
        email, 
        password, 
        phone, 
        jobTitle, 
        department, 
        salary,
        roleId 
    } = await request.json();

    if (!name || !email || !password || !roleId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current user's company ID
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
    });

    if (!currentUser?.companyId) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate employee ID
    const employeeCount = await prisma.user.count({
        where: { companyId: currentUser.companyId },
    });
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

    const employee = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            jobTitle,
            department,
            salary,
            employeeId,
            companyId: currentUser.companyId,
            roleId,
            dateJoined: new Date(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            jobTitle: true,
            department: true,
            status: true,
            dateJoined: true,
            phone: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    // Create leave balance for the new employee
    await prisma.leaveBalance.create({
        data: {
            userId: employee.id,
            year: new Date().getFullYear(),
        },
    });

    return NextResponse.json({ employee }, { status: 201 });
}
