import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

// GET Salary Info
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Change to Promise as per Next.js 15+ breaking changes or simply context if not using strict typing on params in this environment, but standard is `params`
) {
    try {
        const { id } = await params;
        const headersList = await headers();
        const userRole = headersList.get('x-user-role');

        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const salaryInfo = await prisma.salaryInfo.findUnique({
            where: { userId: id }
        });

        if (!salaryInfo) {
            // Return defaults if not found, or 404. Let's return defaults structure with 0 values logic handled by frontend or here.
            // Actually, returning null/404 is fine, frontend handles default state.
            return NextResponse.json({ salaryInfo: null });
        }

        return NextResponse.json({ salaryInfo });
    } catch (error: any) {
        console.error('GET Salary Info Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// UPDATE Salary Info
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const headersList = await headers();
        const userRole = headersList.get('x-user-role');

        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const {
            monthlyWage,
            yearlyWage,
            workingDays,
            basic,
            hra,
            standardAllowance,
            performanceBonus,
            lta,
            fixedAllowance,
            pfEmployee,
            pfEmployer,
            professionalTax
        } = body;

        const salaryInfo = await prisma.salaryInfo.upsert({
            where: { userId: id },
            update: {
                monthlyWage,
                yearlyWage,
                workingDays,
                basic,
                hra,
                standardAllowance,
                performanceBonus,
                lta,
                fixedAllowance,
                pfEmployee,
                pfEmployer,
                professionalTax
            },
            create: {
                userId: id,
                monthlyWage,
                yearlyWage,
                workingDays,
                basic,
                hra,
                standardAllowance,
                performanceBonus,
                lta,
                fixedAllowance,
                pfEmployee,
                pfEmployer,
                professionalTax
            }
        });

        return NextResponse.json({ message: 'Salary Updated', salaryInfo });
    } catch (error: any) {
        console.error('Update Salary Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
