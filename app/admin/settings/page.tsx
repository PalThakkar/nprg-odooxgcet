"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Clock, Menu, AlertCircle, Briefcase, Settings, Building2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        startTime: "09:00",
        workHours: 9,
        gracePeriod: 15
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings/company");
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name,
                    startTime: data.startTime || "09:00",
                    workHours: data.workHours || 9,
                    gracePeriod: data.gracePeriod || 15
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/settings/company", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                router.refresh();
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update settings.' });
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <div className="font-black uppercase text-xl text-white tracking-widest">Loading Configuration...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen font-mono bg-transparent relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-2 border-slate-800 pb-8 bg-slate-950/80 backdrop-blur-sm">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_var(--color-slate-800)]">
                        System Settings
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
                        Configure Core Parameters
                    </p>
                </div>
            </div>

            <div className="brutal-card bg-slate-900 p-8 border-2 border-slate-800 shadow-[8px_8px_0px_0px_var(--color-slate-800)]">
                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Shift Configuration */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 border-b-2 border-slate-800 pb-4">
                            <div className="p-3 bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                                <Clock className="w-6 h-6 text-black" />
                            </div>
                            <h2 className="text-2xl font-black uppercase text-white tracking-tight">Shift & Attendance Rules</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                    Official Start Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-4 bg-slate-950 border-2 border-slate-700 text-white font-bold text-lg focus:border-primary focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all uppercase"
                                />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Start of the work day
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                    Grace Period (Minutes)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={formData.gracePeriod}
                                    onChange={(e) => setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })}
                                    className="w-full px-4 py-4 bg-slate-950 border-2 border-slate-700 text-white font-bold text-lg focus:border-primary focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all uppercase"
                                />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Delay allowed before 'Late' mark
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                                    Standard Work Hours
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={formData.workHours}
                                        onChange={(e) => setFormData({ ...formData, workHours: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-4 bg-slate-950 border-2 border-slate-700 text-white font-bold text-lg focus:border-primary focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all uppercase pr-16"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase">HRS / DAY</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Full day duration requirement
                                </p>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 border-2 font-black uppercase tracking-wide text-sm flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-emerald-900/20 border-emerald-500 text-emerald-500'
                                : 'bg-red-900/20 border-red-500 text-red-500'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    <div className="pt-8 border-t-2 border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-3 px-8 py-4 bg-primary text-slate-950 font-black uppercase tracking-wider border-2 border-primary shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
