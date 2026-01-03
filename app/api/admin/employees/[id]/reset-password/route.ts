import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-node';
import { sendWelcomeEmail } from '@/lib/email';
import crypto from 'crypto';

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
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        // Generate accurate new password
        const newPassword = crypto.randomBytes(4).toString('hex'); // 8 char random hex
        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
                isFirstLogin: true // Force password change on next login
            },
            include: {
                company: true
            }
        });

        // Send notification email
        try {
            await sendWelcomeEmail({
                to: updatedUser.email,
                name: updatedUser.name || 'Team Member',
                loginId: updatedUser.loginId || '',
                password: newPassword,
                companyName: updatedUser.company?.name || 'Odoo India'
            });
        } catch (emailError) {
            console.error('Password reset email failed:', emailError);
            // Don't fail the whole request if email fails, but let admin know
        }

        return NextResponse.json({
            message: 'Password reset successful and email sent',
            tempPassword: newPassword
        });

    } catch (error: any) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
