import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const headersList = await headers();
        const adminId = headersList.get('x-user-id');
        const userRole = headersList.get('x-user-role');

        if (!adminId || userRole !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { message, title } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const notification = await prisma.notification.create({
            data: {
                userId: id,
                title: title || 'New Announcement',
                message: message,
                type: 'ANNOUNCEMENT'
            }
        });

        return NextResponse.json({ message: 'Announcement posted successfully', notification });

    } catch (error: any) {
        console.error('Announce Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
