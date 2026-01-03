'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateSalaryComponents, SalaryComponents } from '@/lib/salary-utils';

interface SalaryInfo extends SalaryComponents {
    monthlyWage: number;
    yearlyWage: number;
    workingDays: number;
    workingHours: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    loginId: string;
    phone: string | null;
    salaryInfo: SalaryInfo | null;
}

export default function EmployeeProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('salary'); // Default to salary for this task
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<SalaryInfo>>({});

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/salary/admin/${id}`);
            const data = await res.json();
            // Combined API for this view
            // We might need to adjust based on actual API response structure
            setUser(data.user ? { ...data.user, salaryInfo: data } : data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWageChange = (value: string) => {
        const wage = parseFloat(value) || 0;
        const components = calculateSalaryComponents(wage);
        setEditData({
            ...editData,
            monthlyWage: wage,
            yearlyWage: wage * 12,
            ...components
        });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/salary/admin/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                const updated = await res.json();
                setUser(prev => prev ? { ...prev, salaryInfo: updated } : null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving salary:', error);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading profile...</div>;
    if (!user) return <div className="p-12 text-center">User not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Profile Header */}
            <div className="flex items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
                <div className="h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg">
                    {user.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <div className="flex gap-4 mt-2 text-muted-foreground">
                        <span>{user.loginId}</span>
                        <span>•</span>
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{user.phone || 'No phone'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Company</p>
                        <p className="font-bold text-lg">Odoo India</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200">
                {['Resume', 'Private Info', 'Salary Info'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                        className={`px-6 py-3 font-medium text-sm transition-all border-b-2 -mb-[2px] ${activeTab === tab.toLowerCase().split(' ')[0]
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'salary' && (
                    <>
                        {/* Left Column: Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-zinc-50/50 border-b">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Salary Components</CardTitle>
                                        {!isEditing ? (
                                            <Button size="sm" onClick={() => {
                                                setIsEditing(true);
                                                setEditData(user.salaryInfo || {});
                                            }}>Edit Info</Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                <Button size="sm" onClick={handleSave}>Save Changes</Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {isEditing ? (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-6 p-6 bg-indigo-50/30 rounded-xl border border-indigo-100">
                                                <div className="space-y-2">
                                                    <Label className="uppercase text-[10px] font-bold tracking-wider text-indigo-600">Month Wage</Label>
                                                    <Input
                                                        type="number"
                                                        className="bg-white border-indigo-200"
                                                        value={editData.monthlyWage || ''}
                                                        onChange={(e) => handleWageChange(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="uppercase text-[10px] font-bold tracking-wider text-indigo-600">Yearly Wage</Label>
                                                    <Input type="number" disabled className="bg-zinc-100 border-zinc-200" value={editData.yearlyWage || ''} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                {[
                                                    { key: 'basic', label: 'Basic Salary', desc: 'Define basic salary from company and compute it based on monthly wage.' },
                                                    { key: 'hra', label: 'House Rent Allowance', desc: 'HRA provided to employee (50% of basic).' },
                                                    { key: 'standardAllowance', label: 'Standard Allowance', desc: 'A fixed amount provided as standard deduction.' },
                                                    { key: 'performanceBonus', label: 'Performance Bonus', desc: 'Variable amount paid during payroll.' },
                                                    { key: 'lta', label: 'Leave Travel Allowance', desc: 'LTA is paid by the company to cover travel expenses.' },
                                                    { key: 'fixedAllowance', label: 'Fixed Allowance', desc: 'Remaining portion of wages after other components.' }
                                                ].map((comp) => (
                                                    <div key={comp.key} className="space-y-1">
                                                        <div className="flex justify-between items-end">
                                                            <Label className="font-semibold text-sm">{comp.label}</Label>
                                                            <span className="text-xs font-mono text-muted-foreground">₹ {(editData as any)[comp.key]?.toLocaleString() || '0'} / month</span>
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-tight mb-2">{comp.desc}</p>
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                type="number"
                                                                className="h-9"
                                                                value={(editData as any)[comp.key] || ''}
                                                                onChange={(e) => setEditData({ ...editData, [comp.key]: parseFloat(e.target.value) || 0 })}
                                                            />
                                                            <span className="text-xs font-medium text-zinc-400">
                                                                {Math.round(((editData as any)[comp.key] / (editData.monthlyWage || 1)) * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-12 p-6 bg-zinc-50 rounded-xl border border-zinc-200">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Month Wage</p>
                                                    <p className="text-3xl font-black">₹ {user.salaryInfo?.monthlyWage.toLocaleString() || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Yearly Wage</p>
                                                    <p className="text-3xl font-black text-indigo-600">₹ {user.salaryInfo?.yearlyWage.toLocaleString() || '0'}</p>
                                                </div>
                                                <div className="ml-auto flex gap-4 text-right">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Days/Week</p>
                                                        <p className="font-bold">{user.salaryInfo?.workingDays || '5'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hrs/Day</p>
                                                        <p className="font-bold">{user.salaryInfo?.workingHours || '8'} Hrs</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                {[
                                                    { key: 'basic', label: 'Basic Salary' },
                                                    { key: 'hra', label: 'House Rent Allowance' },
                                                    { key: 'standardAllowance', label: 'Standard Allowance' },
                                                    { key: 'performanceBonus', label: 'Performance Bonus' },
                                                    { key: 'lta', label: 'Leave Travel Allowance' },
                                                    { key: 'fixedAllowance', label: 'Fixed Allowance' }
                                                ].map((comp) => (
                                                    <div key={comp.key} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                                                        <span className="text-sm font-medium text-muted-foreground">{comp.label}</span>
                                                        <span className="font-mono font-semibold">₹ {(user.salaryInfo as any)?.[comp.key]?.toLocaleString() || '0'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Contributions & Deductions */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-zinc-50/50 border-b">
                                    <CardTitle className="text-lg">Contributions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Provident Fund (PF)</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Employee Contribution</span>
                                            <span className="font-mono">₹ {user.salaryInfo?.pfEmployee.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Employer Contribution</span>
                                            <span className="font-mono">₹ {user.salaryInfo?.pfEmployer.toLocaleString() || '0'}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">PF is calculated based on the basic salary (usually 12%).</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-zinc-50/50 border-b">
                                    <CardTitle className="text-lg">Tax Deductions</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Professional Tax</span>
                                        <span className="font-mono text-red-600">- ₹ {user.salaryInfo?.professionalTax || '200'}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">Professional Tax is deducted from the gross salary.</p>
                                </CardContent>
                            </Card>

                            <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                                </div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Important</p>
                                <p className="text-xs leading-relaxed text-zinc-300">
                                    The Salary Information tab allows users to define and manage all salary-related details for an employee. Salary components are calculated automatically based on the defined Wage.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab !== 'salary' && (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm border border-dashed border-zinc-200">
                        <p className="text-muted-foreground">{activeTab.toUpperCase()} section is under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
