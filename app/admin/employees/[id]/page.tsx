"use client";

import { useState, useEffect, use } from 'react';
import { Loader2, DollarSign, User, Mail, Phone, Building, Calendar, Edit2, Save, X, Briefcase, Calculator, TrendingUp, AlertCircle, Check } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('salary');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<SalaryInfo>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/salary/admin/${id}`);
            const data = await res.json();
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
        setSaving(true);
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
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <div className="font-black uppercase text-xl text-white tracking-widest">Loading Profile...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-slate-800 bg-slate-900 m-8">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase text-white">Employee Not Found</h2>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen font-mono bg-transparent relative z-10">
            {/* Header / Profile Card */}
            <div className="brutal-card mb-8 p-6 md:p-8 bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="h-24 w-24 border-2 border-primary bg-slate-950 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-primary)] shrink-0">
                        <span className="text-3xl font-black uppercase text-white">{user.name.substring(0, 2)}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                            {user.name}
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-3 py-1 border-2 border-slate-700 bg-slate-950 flex items-center gap-2">
                                <User className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{user.loginId}</span>
                            </div>
                            <div className="px-3 py-1 border-2 border-slate-700 bg-slate-950 flex items-center gap-2">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{user.email}</span>
                            </div>
                            <div className="px-3 py-1 border-2 border-slate-700 bg-slate-950 flex items-center gap-2">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{user.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right hidden md:block border-l-2 border-slate-800 pl-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Company</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 justify-end">
                            <Building className="w-5 h-5 text-primary" /> Odoo India
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {['Salary Info', 'Private Info'].map((tab) => {
                    const isActive = activeTab === tab.toLowerCase().split(' ')[0];
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                            className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-primary border-primary text-slate-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-500 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {activeTab === 'salary' && (
                    <>
                        {/* Main Salary Inputs */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="brutal-card bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)] overflow-hidden">
                                <div className="p-6 border-b-2 border-slate-800 flex justify-between items-center bg-slate-950/50">
                                    <h2 className="text-xl font-black uppercase text-white flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-primary" /> Salary Configuration
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditData(user.salaryInfo || {});
                                            }}
                                            className="btn-3d-secondary px-4 py-2 text-xs flex items-center gap-2"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit Mode
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 bg-slate-800 text-white font-bold uppercase text-xs border-2 border-slate-700 hover:bg-slate-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="btn-3d-primary px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8">
                                    {isEditing ? (
                                        <div className="space-y-8">
                                            {/* Wage Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-2 border-primary/20 bg-primary/5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Monthly Gross Wage (₹)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                        <input
                                                            type="number"
                                                            value={editData.monthlyWage || ''}
                                                            onChange={(e) => handleWageChange(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border-2 border-primary text-white font-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-primary)]"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 opacity-60">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Projected Yearly</label>
                                                    <div className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 text-slate-400 font-black text-lg">
                                                        ₹ {(editData.yearlyWage || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Breakdown Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                {[
                                                    { key: 'basic', label: 'Basic Salary (50%)' },
                                                    { key: 'hra', label: 'House Rent Allowance' },
                                                    { key: 'standardAllowance', label: 'Standard Deduction' },
                                                    { key: 'performanceBonus', label: 'Performance Bonus' },
                                                    { key: 'lta', label: 'Leave Travel Allowance' },
                                                    { key: 'fixedAllowance', label: 'Fixed Allowance' }
                                                ].map((comp) => (
                                                    <div key={comp.key} className="space-y-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs font-bold uppercase text-slate-400">{comp.label}</span>
                                                            <span className="text-[10px] font-mono text-slate-600">
                                                                {Math.round(((editData as any)[comp.key] / (editData.monthlyWage || 1)) * 100)}%
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            value={(editData as any)[comp.key] || ''}
                                                            onChange={(e) => setEditData({ ...editData, [comp.key]: parseFloat(e.target.value) || 0 })}
                                                            className="w-full px-3 py-2 bg-slate-950 border-2 border-slate-800 text-white text-sm font-mono focus:border-primary focus:outline-none transition-colors"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Read Only View */}
                                            <div className="flex flex-col md:flex-row items-stretch gap-6">
                                                <div className="flex-1 p-6 border-2 border-slate-800 bg-slate-950">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Monthly Wage</div>
                                                    <div className="text-4xl font-black text-white">₹ {user.salaryInfo?.monthlyWage.toLocaleString() || '0'}</div>
                                                </div>
                                                <div className="flex-1 p-6 border-2 border-slate-800 bg-slate-950">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Yearly Package</div>
                                                    <div className="text-4xl font-black text-primary">₹ {user.salaryInfo?.yearlyWage.toLocaleString() || '0'}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t-2 border-slate-800">
                                                {[
                                                    { key: 'basic', label: 'Basic Salary' },
                                                    { key: 'hra', label: 'HRA' },
                                                    { key: 'standardAllowance', label: 'Std. Allowance' },
                                                    { key: 'performanceBonus', label: 'Bonus' },
                                                    { key: 'lta', label: 'LTA' },
                                                    { key: 'fixedAllowance', label: 'Fixed Allowance' }
                                                ].map((comp, idx) => (
                                                    <div key={comp.key} className="flex justify-between items-center py-2 border-b border-slate-800/50">
                                                        <span className="text-sm font-bold uppercase text-slate-400">{comp.label}</span>
                                                        <span className="font-mono text-white text-lg">₹ {(user.salaryInfo as any)?.[comp.key]?.toLocaleString() || '0'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Stats Column */}
                        <div className="space-y-6">
                            {/* Contributions */}
                            <div className="brutal-card bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)] p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-green-500" /> Contributions (PF)
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-slate-500">Employee Share</span>
                                        <span className="font-mono text-white font-bold">₹ {user.salaryInfo?.pfEmployee.toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-slate-500">Employer Share</span>
                                        <span className="font-mono text-white font-bold">₹ {user.salaryInfo?.pfEmployer.toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="h-px bg-slate-800 my-2"></div>
                                    <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wide">
                                        Calculated as 12% of Basic Salary
                                    </p>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div className="brutal-card bg-slate-900 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)] p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-red-500" /> Tax Deductions
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 border-l-4 border-red-500 bg-red-900/10">
                                        <span className="text-xs font-bold uppercase text-red-200">Professional Tax</span>
                                        <span className="font-mono text-red-400 font-bold">- ₹ {user.salaryInfo?.professionalTax || '200'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-6 bg-slate-950 border-2 border-dashed border-slate-800 text-slate-500">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> System Note
                                </p>
                                <p className="text-xs leading-relaxed uppercase">
                                    Salary components are auto-calculated based on the monthly wage input. Adjustments affect payroll generation immediately.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab !== 'salary' && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-800 bg-slate-900/50">
                        <div className="inline-block p-6 rounded-full bg-slate-800 mb-4 opacity-50">
                            <Briefcase className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white mb-2">Under Development</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{activeTab} module coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}
