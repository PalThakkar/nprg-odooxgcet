import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { comparePassword } from '@/lib/auth-node';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // 'email' might be a Login ID

    // Find User by email OR loginId
    const user = await prisma.user.findFirst({ 
        where: {
          OR: [
            { email: email },
            { loginId: email }
          ]
        },
        include: { role: true, company: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify Password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate Token
    const token = await signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role.name,
      companyId: user.companyId 
    });

    // Set cookie (optional, good for client) but we return token too
    const response = NextResponse.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          loginId: user.loginId,
          role: user.role.name,
          company: user.company?.name
        }, 
        token 
    });
    
    // Cookie for automatic auth compatibility in middleware
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 1 day
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
