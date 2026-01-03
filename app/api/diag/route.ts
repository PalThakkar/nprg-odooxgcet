import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const roles = await prisma.role.findMany();
    const users = await prisma.user.findMany({ include: { role: true, company: true } });
    return NextResponse.json({
        roleNames: roles.map(r => r.name),
        users: users.map(u => ({ email: u.email, role: u.role?.name, company: u.company?.name, companyId: u.companyId }))
    });
}
