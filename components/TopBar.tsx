'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TopBar({ userName, userRole }: { userName?: string, userRole?: string }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-8 w-px bg-gray-200 mx-2" />

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-gray-900 leading-none">{userName || 'User'}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{userRole || 'Employee'}</p>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-150">
                                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="w-4 h-4" />
                                    My Profile
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <SettingsIcon className="w-4 h-4" />
                                    Account Settings
                                </button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={() => {
                                        // Handle logout logic here
                                        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                                        window.location.href = '/auth/login';
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
