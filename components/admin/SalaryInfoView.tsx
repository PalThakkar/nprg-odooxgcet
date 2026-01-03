'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Calculator, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalaryInfoViewProps {
    employeeId: string;
    isAdmin: boolean;
}

export default function SalaryInfoView({ employeeId, isAdmin }: SalaryInfoViewProps) {
    const [wage, setWage] = useState(50000);
    const [workingDays, setWorkingDays] = useState(5);
    const [loading, setLoading] = useState(false);

    // Percentages (Rules)
    const [rules, setRules] = useState({
        basic: 50, // 50% of Wage
        hra: 50,    // 50% of Basic
        standard: 4167, // Fixed or %? Wireframe show both. Let's use % for auto-calc
        performance: 8.33,
        lta: 8.33,
        pf: 12,
        tax: 200
    });

    // Calculated Values
    const basic = (wage * rules.basic) / 100;
    const hra = (basic * rules.hra) / 100;
    const standard = rules.standard; // Fixed for now based on wireframe sample
    const performance = (wage * rules.performance) / 100;
    const lta = (wage * rules.lta) / 100;
    const totalComponents = basic + hra + standard + performance + lta;
    const fixedAllowance = Math.max(0, wage - totalComponents);
    const yearlyWage = wage * 12;

    const pfEmployee = (basic * rules.pf) / 100;
    const pfEmployer = (basic * rules.pf) / 100; // Usually same

    return (
        <div className="space-y-8 animate-in fade-in duration-500 py-4">
            {/* Wage Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Month Wage</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                        <input
                            type="number"
                            value={wage}
                            onChange={(e) => setWage(Number(e.target.value))}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-10 pr-4 text-xl font-black text-gray-900 focus:ring-4 focus:ring-indigo-50"
                            disabled={!isAdmin}
                        />
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <span className="text-xs font-bold text-gray-500">Yearly Wage: ₹{yearlyWage.toLocaleString()}</span>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Working Schedule</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Days/Week</span>
                            <input
                                type="number"
                                value={workingDays}
                                onChange={(e) => setWorkingDays(Number(e.target.value))}
                                className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-900"
                                disabled={!isAdmin}
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Break Time (hrs)</span>
                            <input
                                type="number"
                                defaultValue={1}
                                className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-900"
                                disabled={!isAdmin}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Components Table */}
            <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Salary Components</h3>
                    <Calculator className="w-4 h-4 text-indigo-500" />
                </div>

                <div className="p-2">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="px-6 py-4">Component</th>
                                <th className="px-6 py-4">Monthly Value</th>
                                <th className="px-6 py-4 text-right">Calculation (%)</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            <ComponentRow label="Basic Salary" amount={basic} percentage={rules.basic} />
                            <ComponentRow label="House Rent Allowance" amount={hra} percentage={rules.hra} subtext="(50% of Basic)" />
                            <ComponentRow label="Standard Allowance" amount={standard} percentage={16.67} subtext="Fixed Amount" />
                            <ComponentRow label="Performance Bonus" amount={performance} percentage={rules.performance} />
                            <ComponentRow label="Leave Travel Allowance" amount={lta} percentage={rules.lta} />
                            <ComponentRow label="Fixed Allowance" amount={fixedAllowance} percentage={11.67} isCalculated />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PF & Tax Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-3xl space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Provident Fund (12%)</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Employee Contribution</span>
                            <span className="font-bold text-gray-900">₹{pfEmployee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Employer Contribution</span>
                            <span className="font-bold text-gray-900">₹{pfEmployer.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-rose-50/30 border border-rose-100 p-6 rounded-3xl space-y-4">
                    <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Tax Deductions</h4>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Professional Tax</span>
                        <span className="font-bold text-rose-600">₹{rules.tax}.00</span>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black shadow-lg shadow-indigo-100">
                    <Save className="w-5 h-5 mr-3" />
                    Update Salary Structure
                </Button>
            )}
        </div>
    );
}

function ComponentRow({ label, amount, percentage, subtext, isCalculated }: { label: string, amount: number, percentage: number, subtext?: string, isCalculated?: boolean }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">{label}</span>
                    {subtext && <span className="text-[10px] text-gray-400 font-bold">{subtext}</span>}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={cn("font-black", isCalculated ? "text-indigo-600" : "text-gray-900")}>₹{amount.toFixed(2)}</span>
            </td>
            <td className="px-6 py-4 text-right">
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-500">{percentage}%</span>
            </td>
        </tr>
    );
}
