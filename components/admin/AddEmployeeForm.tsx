'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddEmployeeFormProps {
    onSuccess?: (employee: any) => void;
}

export default function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessData(null);

        try {
            const res = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create employee');
            }

            setSuccessData(data.user);
            setFormData({ name: '', email: '', phone: '', password: '' });
            if (onSuccess) onSuccess(data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Employee Created!</h3>
                <p className="text-gray-600 mb-6">The employee has been added to the system successfully.</p>

                <div className="bg-white rounded-xl p-4 border border-green-100 text-left space-y-3 mb-6 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Login Credentials</p>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Login ID:</span>
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-base">{successData.loginId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-semibold text-gray-900">{successData.email}</span>
                    </div>
                </div>

                <Button
                    onClick={() => setSuccessData(null)}
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    Add Another Employee
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                New Employee Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="name"
                            placeholder="e.g. Johnathan Doe"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="johnathan@company.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password">Initial Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 italic">
                        * The login ID will be generated automatically based on the employee name.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3 animate-in fade-in duration-300">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-base font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating...</span>
                        </div>
                    ) : (
                        'Create Employee Account'
                    )}
                </Button>
            </form>
        </div>
    );
}
