import { headers } from 'next/headers';

export default async function DashboardPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
                <p className="text-lg">Welcome back!</p>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p><strong>User ID:</strong> {userId}</p>
                    <p><strong>Role:</strong> <span className="inline-block px-2 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800 uppercase">{userRole}</span></p>
                </div>

                {userRole === 'admin' && (
                    <div className="mt-8 border-t pt-4">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Admin Area</h2>
                        <p>You have access to sensitive controls.</p>
                        {/* Admin controls would go here */}
                    </div>
                )}
            </div>
        </div>
    );
}
