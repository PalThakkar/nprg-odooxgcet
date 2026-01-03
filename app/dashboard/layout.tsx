import React from 'react';
import SideNav from '@/components/SideNav';
import TopBar from '@/components/TopBar';
import { headers } from 'next/headers';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const userName = headersList.get('x-user-login-id') || 'User'; // Adjust based on how you store name
    const userRole = headersList.get('x-user-role') || 'Employee';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNav />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar userName={userName} userRole={userRole} />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
