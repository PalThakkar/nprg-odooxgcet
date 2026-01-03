"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Save token (using localStorage for simplicity, in production use cookies)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const userRole = data.user.role?.toLowerCase();

            if (userRole === 'admin') {
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

            <div className="floating-cube" style={{ top: "10%", left: "10%", animationDelay: "0s" }}>
                <div className="cube-face face-front"></div>
                <div className="cube-face face-back"></div>
                <div className="cube-face face-right"></div>
                <div className="cube-face face-left"></div>
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
            </div>

            <div className="floating-cube" style={{ bottom: "10%", right: "10%", animationDelay: "-5s" }}>
                <div className="cube-face face-front"></div>
                <div className="cube-face face-back"></div>
                <div className="cube-face face-right"></div>
                <div className="cube-face face-left"></div>
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
            </div>

            <div className="w-full max-w-md bg-slate-900 border-2 border-primary p-8 relative z-10 shadow-[8px_8px_0px_0px_var(--color-primary)]">
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
                        Sign In
                    </h1>
                    <p
                        className="text-sm mt-2 font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-slate-400)" }}
                    >
                        HR Management System
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div
                            className="text-sm p-4 font-bold uppercase tracking-wide border-2 border-red-500 bg-red-500/10 text-red-500 shadow-[4px_4px_0px_0px_var(--color-red-500)]"
                        >
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Login Id/Email
                        </label>
                        <div className="relative group">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="input-field pl-12"
                                placeholder="ENTER YOUR ID OR EMAIL"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs font-bold uppercase tracking-widest ml-1"
                            style={{ color: "var(--color-slate-300)" }}
                        >
                            Password
                        </label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
                                style={{ color: "var(--color-slate-500)" }}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12 pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                                style={{ color: "var(--color-slate-500)" }}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-lg"
                    >
                        {loading ? (
                            <div
                                className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"
                            />
                        ) : (
                            "ACCESS DASHBOARD"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t-2 border-slate-800 pt-6">
                    <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--color-slate-400)" }}>
                        No Account?{" "}
                        <Link
                            href="/auth/signup"
                            className="text-primary hover:text-white underline decoration-2 underline-offset-4 decoration-primary transition-colors ml-1"
                        >
                            REGISTER NOW
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
