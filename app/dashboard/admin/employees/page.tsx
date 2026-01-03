'use client';

import React, { useState, useEffect } from 'react';
import AddEmployeeForm from '@/components/admin/AddEmployeeForm';
import EmployeeDetailTile from '@/components/EmployeeDetailTile';
import { Users, Plus, LayoutGrid, List, Search as SearchIcon, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminEmployeesPage() {
    const [isAdding, setIsAdding] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/admin/employees');
            const data = await res.json();
            if (data.employees) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.loginId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Employee Hub</h1>
                        <p className="text-gray-500 font-medium">Manage your workforce at Odoo India</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`h-12 px-6 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${isAdding
                        ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-gray-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                        }`}
                >
                    {isAdding ? (
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Directory</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            <span>Register Employee</span>
                        </div>
                    )}
                </Button>
            </div>

            {isAdding ? (
                <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
                    <AddEmployeeForm onSuccess={() => fetchEmployees()} />
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, ID or email..."
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-sm shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 shadow-sm shrink-0">
                            <button className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm"><LayoutGrid className="w-5 h-5" /></button>
                            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"><List className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-gray-400 font-medium animate-pulse">Scanning workforce directory...</p>
                        </div>
                    ) : filteredEmployees.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredEmployees.map((emp) => (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmployee(emp)}
                                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 transition-all group cursor-pointer overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-black text-xl overflow-hidden group-hover:scale-105 transition-transform">
                                            {emp.avatarUrl ? (
                                                <img src={emp.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                emp.name?.substring(0, 1).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${emp.status === 'present' ? 'bg-green-500' : 'bg-gray-300'} shadow-sm shadow-current`} />
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{emp.status || 'Offline'}</p>
                                            </div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase truncate max-w-[120px]">{emp.name}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee ID</span>
                                            <span className="text-xs font-mono font-black text-indigo-600">{emp.loginId}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500 capitalize">{emp.role?.name || 'Employee'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 py-32 text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nobody found here</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">Try a different search term or register a new team member to populate the directory.</p>
                            <Button
                                variant="ghost"
                                className="mt-6 text-indigo-600 hover:bg-indigo-50 font-bold"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear current search
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Tile */}
            {selectedEmployee && (
                <EmployeeDetailTile
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                />
            )}
        </div>
    );
}
