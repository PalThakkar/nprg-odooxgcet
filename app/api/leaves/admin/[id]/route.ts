import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminComment } = await req.json();
    const headerList = await headers();
    const companyId = headerList.get('x-user-company-id');
    const { id } = await params;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID not found in session' }, { status: 400 });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Ensure the leave request belongs to the admin's company
    const leave = await prisma.leaveRequest.findUnique({
      where: { id }
    });

    if (!leave || leave.companyId !== companyId) {
      return NextResponse.json({ error: 'Leave request not found or unauthorized' }, { status: 404 });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        adminComment,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedLeave);
  } catch (error: any) {
    console.error('Update leave error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
