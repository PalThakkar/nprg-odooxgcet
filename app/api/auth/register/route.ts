import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth-node';
import { generateLoginId } from '@/lib/id-generator';

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, companyName, companyInitials } = await req.json();

    if (!email || !password || !name || !companyName || !companyInitials) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Check if company exists
    const existingCompany = await prisma.company.findFirst({
      where: { name: { equals: companyName, mode: 'insensitive' } }
    });
    if (existingCompany) {
      return NextResponse.json({ error: 'Company with this name already exists' }, { status: 409 });
    }

    const { user, loginId } = await prisma.$transaction(async (tx) => {
      // 1. Get or Create Admin Role
      let role = await tx.role.findUnique({ where: { name: 'admin' } });
      if (!role) {
        role = await tx.role.create({ data: { name: 'admin', description: 'Company Admin role' } });
      }

      // 2. Create Company
      const company = await tx.company.create({
        data: {
          name: companyName,
          initials: companyInitials.toUpperCase().substring(0, 2),
        }
      });

      // 3. Generate Login ID
      const generatedLoginId = await generateLoginId(
        company.id,
        company.initials,
        name,
        new Date().getFullYear(),
        tx
      );

      // 4. Hash password
      const hashedPassword = await hashPassword(password);

      // 5. Create Admin User
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          loginId: generatedLoginId,
          companyId: company.id,
          roleId: role.id,
          isFirstLogin: true,
        },
        include: { role: true, company: true }
      });

      return { user: newUser, loginId: generatedLoginId };
    });

    // Generate Token
    const token = await signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role.name,
      companyId: user.companyId 
    });

    return NextResponse.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          loginId: user.loginId,
          role: user.role.name,
          company: user.company?.name
        }, 
        token 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
