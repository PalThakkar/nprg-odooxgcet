'use client';

import React from 'react';
import { X, Mail, Phone, Briefcase, Calendar, Shield, MapPin, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmployeeDetailTileProps {
    employee: any;
    onClose: () => void;
}

export default function EmployeeDetailTile({ employee, onClose }: EmployeeDetailTileProps) {
    if (!employee) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Tile */}
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Header/Banner */}
                <div className="h-32 bg-indigo-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-8 pb-8 pt-0 -mt-16">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 border-8 border-white shadow-xl flex items-center justify-center text-indigo-700 font-black text-4xl overflow-hidden">
                                {employee.avatarUrl ? (
                                    <img src={employee.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    employee.name?.substring(0, 1).toUpperCase() || 'U'
                                )}
                            </div>
                            <div className={cn(
                                "absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg",
                                employee.status === 'present' ? 'bg-green-500' : 'bg-gray-300'
                            )} />
                        </div>

                        <div className="flex-1 pb-2">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                {employee.name || 'Unknown User'}
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {employee.role?.name || 'Employee'}
                                </span>
                            </h2>
                            <p className="text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                <Shield className="w-4 h-4" />
                                ID: <span className="font-mono text-indigo-600">{employee.loginId || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Grid Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem icon={Mail} label="Email Address" value={employee.email || 'N/A'} />
                        <DetailItem icon={Phone} label="Phone Number" value={employee.phone || 'N/A'} />
                        <DetailItem icon={Briefcase} label="Department" value="Operations" />
                        <DetailItem icon={Calendar} label="Joining Date" value="Jan 12, 2024" />
                        <DetailItem icon={MapPin} label="Location" value="Ahmedabad, India" />
                        <DetailItem icon={Globe} label="Timezone" value="IST (GMT+5:30)" />
                    </div>

                    <div className="h-px bg-gray-100 my-8" />

                    {/* Action Footer */}
                    <div className="flex flex-wrap gap-4">
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl text-base font-bold shadow-lg shadow-indigo-100">
                            <Mail className="w-5 h-5 mr-2" />
                            Message Team Member
                        </Button>
                        <Button variant="outline" className="flex-1 border-gray-200 h-14 rounded-2xl text-base font-bold hover:bg-gray-50">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payroll Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-default">
            <div className="flex items-center gap-3 mb-1">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{label}</span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
        </div>
    );
}
