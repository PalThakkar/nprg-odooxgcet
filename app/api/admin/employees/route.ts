import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-node';
import { generateLoginId } from '@/lib/id-generator';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const adminId = headersList.get('x-user-id');
    const companyId = headersList.get('x-user-company-id');
    const userRole = headersList.get('x-user-role');

    if (!adminId || userRole?.toLowerCase() !== 'admin' || !companyId) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields: name, email, password' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const newUser = await prisma.$transaction(async (tx: any) => {
      // 1. Get Company Details for ID generation
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { initials: true, id: true }
      });

      if (!company) {
        throw new Error('Associated company not found');
      }

      // 2. Generate Unique Login ID using existing template
      const loginId = await generateLoginId(
        company.id,
        company.initials,
        name,
        new Date().getFullYear(),
        tx
      );

      // 3. Hash Initial Password
      const hashedPassword = await hashPassword(password);

      // 4. Get 'user' role
      let userRoleRecord = await tx.role.findUnique({ where: { name: 'user' } });
      if (!userRoleRecord) {
        userRoleRecord = await tx.role.create({
          data: { name: 'user', description: 'Standard employee role' }
        });
      }

      // 5. Create the User
      return await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          loginId,
          companyId: company.id,
          roleId: userRoleRecord.id,
          status: 'absent',
          isFirstLogin: true,
          salaryInfo: {
            create: {
              monthlyWage: 0,
              yearlyWage: 0,
              basic: 0,
              hra: 0,
              standardAllowance: 0,
              performanceBonus: 0,
              lta: 0,
              fixedAllowance: 0,
              pfEmployee: 0,
              pfEmployer: 0,
              professionalTax: 200
            }
          },
          privateInfo: {
            create: {
              empCode: loginId
            }
          }
        },
        select: {
          id: true,
          loginId: true,
          name: true,
          email: true
        }
      });
    });

    // 6. Send Welcome Email (Non-blocking or catch errors to not fail user creation)
    try {
      // Get the company name from the user's company relation
      const company = await prisma.company.findUnique({
        where: { id: companyId! }
      });

      await sendWelcomeEmail({
        to: email,
        name,
        loginId: newUser.loginId!,
        password: password, // Send the plain text password from the request
        companyName: company?.name || 'Odoo India'
      });
    } catch (emailError) {
      console.error('Failed to send welcome email, but user was created:', emailError);
    }

    return NextResponse.json({
      message: 'Employee created successfully',
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error('Admin Create Employee Error:', error);
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('GET /api/admin/employees started');
    const headersList = await headers();
    const adminId = headersList.get('x-user-id');
    const companyId = headersList.get('x-user-company-id');
    const userRole = headersList.get('x-user-role');
    const loginIdHeader = headersList.get('x-user-login-id');
    console.log('Headers from Request:', { adminId, companyId, userRole, loginIdHeader });

    if (!(adminId || loginIdHeader) || userRole?.toLowerCase() !== 'admin' || !companyId) {
      console.log('Unauthorized access attempt - Missing required headers or not admin');
      return NextResponse.json({
        error: 'Unauthorized',
        debug: { adminId, companyId, userRole, loginIdHeader }
      }, { status: 403 });
    }

    console.log('Fetching employees for company:', companyId);

    // Debug: Check if any users exist at all
    const totalUsersCount = await prisma.user.count();
    console.log('Total users in DB:', totalUsersCount);

    const employees = await prisma.user.findMany({
      where: {
        companyId: companyId,
        // role: { name: 'user' } // Commending out to see all users
      },
      include: {
        role: true,
        salaryInfo: true,
        privateInfo: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Employees found for company ${companyId}:`, employees.length);

    return NextResponse.json({
      employees,
      debug: {
        companyId,
        adminId,
        userRole,
        totalUsersCount,
        returnedCount: employees.length
      }
    });
  } catch (error: any) {
    console.error('GET Employees Error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

