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

      if (data.user.role === 'admin') {
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="auth-bg" />

      <div className="w-full max-w-md glass-card animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, color-mix(in srgb, var(--color-teal-500) 50%, transparent), color-mix(in srgb, var(--color-emerald-500) 50%, transparent))`,
            }}
          >
            <Building2
              className="w-10 h-10"
              style={{ color: "var(--color-white)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-white)" }}
          >
            Sign in Page
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-slate-400)" }}
          >
            Human Resource Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="text-sm p-3 rounded-lg animate-shake"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-red-500) 10%, transparent)`,
                border: "1px solid var(--color-red-500)",
                color: "var(--color-red-500)",
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              className="text-sm font-medium ml-1"
              style={{ color: "var(--color-slate-300)" }}
            >
              Login Id/Email :-
            </label>
            <div className="relative group">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl py-3 pl-11 pr-4 transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="Enter your Login ID or Email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium ml-1"
              style={{ color: "var(--color-slate-300)" }}
            >
              Password :-
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl py-3 pl-11 pr-12 transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
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
            className="w-full font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
            style={{
              background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
              color: "var(--color-white)",
            }}
          >
            {loading ? (
              <div
                className="w-6 h-6 border-3 rounded-full animate-spin"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderTopColor: "var(--color-white)",
                }}
              />
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--color-slate-400)" }}>
            Don't have an Account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold underline-offset-4 hover:underline transition-colors"
              style={{ color: "var(--color-teal-400)" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
