'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Plane, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmployeeStatus = 'present' | 'absent' | 'on-leave';

interface EmployeeCardProps {
    name: string;
    role: string;
    status: EmployeeStatus;
    avatarUrl?: string;
    onClick?: () => void;
}

const statusColors = {
    present: 'bg-green-500',
    absent: 'bg-yellow-500',
    'on-leave': 'bg-blue-500',
};

const statusIcons = {
    present: MapPin,
    absent: Clock,
    'on-leave': Plane,
};

export default function EmployeeCard({ name, role, status, avatarUrl, onClick }: EmployeeCardProps) {
    return (
        <Card
            className="group hover:shadow-md transition-all cursor-pointer border-gray-200 overflow-hidden"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <div className={cn(
                            "absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                            statusColors[status]
                        )}>
                            {status === 'on-leave' && <Plane className="w-2.5 h-2.5 text-white" />}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Clock({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
