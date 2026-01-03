'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Employee {
    id: string;
    name: string;
    email: string;
    loginId: string;
    role: { name: string };
    status: string;
}

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/admin/employees'); // Need to implement this endpoint
            const data = await res.json();
            if (Array.isArray(data)) {
                setEmployees(data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.loginId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Employee Directory</h1>
                    <p className="text-muted-foreground">Manage your team and their information.</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search employees..."
                        className="w-[300px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-12 text-muted-foreground">Loading employees...</p>
                ) : filtered.length === 0 ? (
                    <p className="col-span-full text-center py-12 text-muted-foreground">No employees found.</p>
                ) : (
                    filtered.map(emp => (
                        <Card key={emp.id} className="hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg uppercase">
                                                {emp.name.substring(0, 2)}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${emp.status === 'present' ? 'bg-green-500' :
                                                    emp.status === 'on-leave' ? 'bg-blue-500' : 'bg-gray-300'
                                                }`} title={emp.status}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{emp.loginId}</span>
                                                <span>•</span>
                                                <span className="capitalize">{emp.status || 'absent'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-100 uppercase">{emp.role.name}</span>
                                        <Link href={`/dashboard/admin/employees/${emp.id}`}>
                                            <Button variant="ghost" size="sm">View Profile</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
