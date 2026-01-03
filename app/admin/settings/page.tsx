"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Clock, Briefcase, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
        try {
            const res = await fetch("/api/admin/settings/company", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.refresh();
                // Optional: Show success toast
            } else {
                console.error("Failed to update settings");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Company Settings</h1>
                <p className="text-slate-400 mt-2">Configure attendance policies and company details.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Shift Configuration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-indigo-400 mb-4">
                            <Clock className="w-6 h-6" />
                            <h2 className="text-xl font-semibold">Shift & Attendance</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Shift Start Time</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <p className="text-xs text-slate-500">Official starting time of the work day.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Grace Period (Minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={formData.gracePeriod}
                                    onChange={(e) => setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <p className="text-xs text-slate-500">Allowed delay before marking as 'Late'.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Standard Work Hours</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={formData.workHours}
                                        onChange={(e) => setFormData({ ...formData, workHours: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                    <span className="absolute right-4 top-3 text-slate-500 text-sm font-medium">Hrs</span>
                                </div>
                                <p className="text-xs text-slate-500">Duration required for a full day. Less than half is 'Half-day'.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
