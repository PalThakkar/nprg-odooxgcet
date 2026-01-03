"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Mail, Phone, Building2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        companyName: "",
        companyInitials: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await register({
                companyName: formData.companyName,
                companyInitials: formData.companyInitials,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            
            // Success - normally we'd show a success modal with their Login ID
            alert(`Account Created! Your initial Login ID is: ${formData.companyInitials.toUpperCase()}-001-${new Date().getFullYear()}`);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="auth-bg" />

            <div className="w-full max-w-lg glass-card animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
                        <Building2 className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Sign Up Page</h1>
                    <p className="text-zinc-400 text-sm mt-1">Register your company for HRMS</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {error && (
                        <div className="md:col-span-2 bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Company Name :-</label>
                        <div className="relative group">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                name="companyName"
                                type="text"
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                placeholder="e.g. Odoo India"
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 p-1.5 rounded-lg text-white hover:bg-blue-500 transition-colors">
                                <Upload size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Initials :-</label>
                        <input
                            name="companyInitials"
                            type="text"
                            required
                            maxLength={2}
                            value={formData.companyInitials}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder="e.g. OI"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Admin Name :-</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email :-</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="admin@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Phone :-</label>
                        <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Password :-</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Confirm :-</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-widest"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-zinc-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold underline-offset-4 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
