'use client';

import React from 'react';
import { User, MapPin, Globe, Mail, Heart, Calendar, CreditCard, Landmark, Fingerprint, BadgeInfo, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivateInfoViewProps {
    employee: any;
    isAdmin: boolean;
}

export default function PrivateInfoView({ employee, isAdmin }: PrivateInfoViewProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 py-4">
            {/* Personal Information */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Personal Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoInput icon={Calendar} label="Date of Birth" placeholder="Select date" type="date" disabled={!isAdmin} />
                    <InfoInput icon={MapPin} label="Residing Address" placeholder="Street, City, Zip" disabled={!isAdmin} />
                    <InfoInput icon={Globe} label="Nationality" placeholder="e.g. Indian" disabled={!isAdmin} />
                    <InfoInput icon={Mail} label="Personal Email" placeholder="personal@example.com" disabled={!isAdmin} />
                    <InfoInput icon={Heart} label="Marital Status" placeholder="Single / Married" disabled={!isAdmin} />
                    <InfoInput icon={BadgeInfo} label="Gender" placeholder="Male / Female" disabled={!isAdmin} />
                </div>
            </div>

            {/* Financial & Corporate */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-500" />
                    Bank & Corporate Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoInput icon={CreditCard} label="Account Number" placeholder="0000 0000 0000" disabled={!isAdmin} />
                    <InfoInput icon={Landmark} label="Bank Name" placeholder="e.g. HDFC Bank" disabled={!isAdmin} />
                    <InfoInput icon={Fingerprint} label="IFSC Code" placeholder="HDFC0001234" disabled={!isAdmin} />
                    <InfoInput icon={BadgeInfo} label="PAN Number" placeholder="ABCDE1234F" disabled={!isAdmin} />
                    <InfoInput icon={BadgeInfo} label="UAN Number" placeholder="100000000000" disabled={!isAdmin} />
                    <InfoInput icon={BadgeInfo} label="Employee Code" placeholder="EMP-001" disabled={!isAdmin} />
                </div>
            </div>

            {isAdmin && (
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                    <Save className="w-5 h-5 mr-3" />
                    Save All Changes
                </Button>
            )}
        </div>
    );
}

function InfoInput({ icon: Icon, label, placeholder, type = "text", disabled }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                />
            </div>
        </div>
    );
}
