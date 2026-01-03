"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Clock, Briefcase, AlertCircle, Settings, Building2, Users, Calendar } from "lucide-react";
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
                <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Company Settings</h1>
                <p style={{ color: "var(--muted-foreground)" }} className="mt-2">Configure attendance policies and company details.</p>
            </div>

            <div className="card-gradient rounded-3xl p-8 border border-border/50">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Shift Configuration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4" style={{ color: "var(--primary)" }}>
                            <Clock className="w-6 h-6" style={{ color: "white" }} />
                            <h2 className="text-xl font-semibold">Shift & Attendance</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Shift Start Time</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="input-field"
                                />
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Official starting time of the work day.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Grace Period (Minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={formData.gracePeriod}
                                    onChange={(e) => setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Allowed delay before marking as 'Late'.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Standard Work Hours</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={formData.workHours}
                                        onChange={(e) => setFormData({ ...formData, workHours: parseFloat(e.target.value) })}
                                        className="input-field pl-16"
                                    />
                                    <span className="absolute left-9.75 top-2.75 text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>Hrs</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Duration required for a full day. Less than half is 'Half-day'.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end" style={{ borderColor: "var(--border)" }}>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
