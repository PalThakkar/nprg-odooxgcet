import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth-node';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get or Create Default Role 'user'
    let role = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!role) {
      role = await prisma.role.create({ data: { name: 'user', description: 'Default user role' } });
    }

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: role.id
      },
      include: { role: true }
    });

    // Generate Token
    const token = await signToken({ id: user.id, email: user.email, role: user.role.name });

    return NextResponse.json({ 
        user: { id: user.id, email: user.email, name: user.name, role: user.role.name }, 
        token 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
