"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Eye,
    EyeOff,
    Lock,
    User,
    Mail,
    Phone,
    Building2,
    Upload,
} from "lucide-react";

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
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Success - normally we'd show a success modal with their Login ID
            alert(`Account Created! Your initial Login ID is: ${data.user.loginId}`);
            if (data.user.role === "admin") {
                router.push("/admin/employees");
            } else {
                router.push("/employees");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
            {/* 3D Background Elements */}
            <div className="perspective-container">
                <div className="grid-3d"></div>
            </div>

            <div className="floating-cube" style={{ top: "15%", left: "5%", animationDelay: "-2s" }}>
                <div className="cube-face face-front"></div>
                <div className="cube-face face-back"></div>
                <div className="cube-face face-right"></div>
                <div className="cube-face face-left"></div>
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
            </div>

            <div className="floating-cube" style={{ bottom: "15%", right: "5%", animationDelay: "-7s" }}>
                <div className="cube-face face-front"></div>
                <div className="cube-face face-back"></div>
                <div className="cube-face face-right"></div>
                <div className="cube-face face-left"></div>
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
            </div>

            <div className="w-full max-w-lg bg-slate-900 border-2 border-primary p-8 relative z-10 shadow-[8px_8px_0px_0px_var(--color-primary)]">
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-16 h-16 flex items-center justify-center mb-4 border-2 border-primary bg-slate-800 shadow-[4px_4px_0px_0px_var(--color-primary)]"
                    >
                        <Building2
                            className="w-8 h-8 text-primary"
                        />
                    </div>
                    <h1
                        className="text-3xl font-black tracking-tighter uppercase"
                        style={{ color: "var(--color-white)" }}
                    >
                        Sign Up
                    </h1>
                    <p
                        className="text-sm mt-2 font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-slate-400)" }}
                    >
                        Register your company
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                >
                    {error && (
                        <div
                            className="md:col-span-2 text-sm p-4 font-bold uppercase tracking-wide border-2 border-red-500 bg-red-500/10 text-red-500 shadow-[4px_4px_0px_0px_var(--color-red-500)] text-center"
                        >
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5 md:col-span-2">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Company Name
                        </label>
                        <div className="relative group">
                            <Building2
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="companyName"
                                type="text"
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                                className="input-field pl-10 pr-12 text-sm"
                                placeholder="E.G. ODOO INDIA"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-slate-900 border-2 border-transparent hover:border-slate-900 transition-colors"
                            >
                                <Upload size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Initials
                        </label>
                        <input
                            name="companyInitials"
                            type="text"
                            required
                            maxLength={2}
                            value={formData.companyInitials}
                            onChange={handleChange}
                            className="input-field px-4 text-sm uppercase"
                            placeholder="E.G. OI"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Admin Name
                        </label>
                        <div className="relative group">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field pl-10 px-4 text-sm"
                                placeholder="FULL NAME"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Email
                        </label>
                        <div className="relative group">
                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field pl-10 px-4 text-sm"
                                placeholder="ADMIN@COMPANY.COM"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Phone
                        </label>
                        <div className="relative group">
                            <Phone
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field pl-10 px-4 text-sm"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Password
                        </label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pl-10 pr-10 text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
                                style={{ color: "var(--color-slate-500)" }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Confirm
                        </label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field pl-10 pr-10 text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 mt-4 btn-primary w-full text-lg"
                    >
                        {loading ? (
                            <div
                                className="w-5 h-5 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"
                            />
                        ) : (
                            "CREATE ACCOUNT"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center border-t-2 border-slate-800 pt-6">
                    <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--color-slate-400)" }}>
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-primary hover:text-white underline decoration-2 underline-offset-4 decoration-primary transition-colors ml-1"
                        >
                            SIGN IN
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
