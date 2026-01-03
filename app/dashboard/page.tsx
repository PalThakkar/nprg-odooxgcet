import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import EmployeeGrid from '@/components/EmployeeGrid';
import AttendanceTray from '@/components/AttendanceTray';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    const companyId = headersList.get('x-user-company-id');

    // Fetch employees from the database
    const employees = await prisma.user.findMany({
        where: {
            companyId: companyId || '' // Ensure we filter by company, if no companyId (shouldn't happen due to middleware) it returns empty or matches null depending on logic, but empty string is safer to return nothing if uuid expected
        },
        include: {
            role: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    // Fetch current user for status
    const currentUser = await prisma.user.findUnique({
        where: { id: userId || '' },
        include: { role: true }
    });

    const userRole = currentUser?.role?.name;
    const loginId = currentUser?.loginId;

    const statusColors: Record<string, string> = {
        present: 'text-green-600',
        absent: 'text-red-600',
        'on-leave': 'text-blue-600'
    };

    const statusText: Record<string, string> = {
        present: 'Active',
        absent: 'Absent',
        'on-leave': 'On Leave'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <Button>Download Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Profile Status</p>
                        <p className={`text-2xl font-bold mt-2 capitalize ${statusColors[currentUser?.status || 'absent'] || 'text-gray-600'}`}>
                            {statusText[currentUser?.status || ''] || currentUser?.status || 'Absent'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Welcome back, {userRole === 'admin' ? 'Administrator' : 'Employee'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">You are currently logged in as <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-900">{loginId}</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Card className="bg-indigo-50 border-indigo-100 border shadow-none">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-indigo-900">Request Time Off</p>
                                    <p className="text-xs text-indigo-700">Submit a new leave request.</p>
                                </div>
                                <Button size="sm" className="bg-indigo-600">Submit</Button>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            <div className="pb-24">
                <EmployeeGrid initialEmployees={employees} viewerRole={userRole} />
                <AttendanceTray />
            </div>
        </div>
    );
}

