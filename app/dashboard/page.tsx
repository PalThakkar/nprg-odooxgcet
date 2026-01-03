import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import EmployeeGrid from '@/components/EmployeeGrid';
import AttendanceTray from '@/components/AttendanceTray';

export default async function DashboardPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    // Fetch employees from the database
    const employees = await prisma.user.findMany({
        include: {
            role: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="pb-24">
            <EmployeeGrid initialEmployees={employees} />
            <AttendanceTray />
        </div>
    );
}
