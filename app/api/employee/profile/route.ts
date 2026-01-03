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
    const employeeId = searchParams.get('employeeId');

    // Build filter based on role
    let targetUserId = userId;
    if ((userRole === 'admin' || userRole === 'hr') && employeeId) {
        targetUserId = employeeId;
    }

    const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            address: true,
            employeeId: true,
            jobTitle: true,
            department: true,
            dateJoined: true,
            salary: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            company: {
                select: {
                    id: true,
                    name: true,
                    initials: true,
                    logoUrl: true,
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    // Build filter based on role
    let targetUserId = userId;
    if ((userRole === 'admin' || userRole === 'hr') && employeeId) {
        targetUserId = employeeId;
    }

    const updateData = await request.json();
    let updatedUser;

    // Employees can only update limited fields
    if (userRole !== 'admin' && userRole !== 'hr') {
        const allowedFields = ['name', 'phone', 'address', 'avatarUrl'];
        const filteredData: any = {};
        
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        }
        
        updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: filteredData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                employeeId: true,
                jobTitle: true,
                department: true,
                dateJoined: true,
                salary: true,
                avatarUrl: true,
                status: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        initials: true,
                        logoUrl: true,
                    },
                },
            },
        });
    } else {
        // Admin/HR can update all fields
        updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                employeeId: true,
                jobTitle: true,
                department: true,
                dateJoined: true,
                salary: true,
                avatarUrl: true,
                status: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        initials: true,
                        logoUrl: true,
                    },
                },
            },
        });
    }

    return NextResponse.json({ user: updatedUser });
}
