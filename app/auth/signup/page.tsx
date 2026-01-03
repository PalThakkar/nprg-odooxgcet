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
      router.push("/auth/login");
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
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, color-mix(in srgb, var(--color-teal-500) 50%, transparent), color-mix(in srgb, var(--color-emerald-500) 50%, transparent))`,
            }}
          >
            <Building2
              className="w-8 h-8"
              style={{ color: "var(--color-white)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-white)" }}
          >
            Sign Up Page
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-slate-400)" }}
          >
            Register your company for HRMS
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          {error && (
            <div
              className="md:col-span-2 text-sm p-3 rounded-lg text-center"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-red-500) 10%, transparent)`,
                border: "1px solid var(--color-red-500)",
                color: "var(--color-red-500)",
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5 md:col-span-2">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Company Name :-
            </label>
            <div className="relative group">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 pr-12 text-sm transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="e.g. Odoo India"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--color-teal-600)",
                  color: "var(--color-white)",
                }}
              >
                <Upload size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Initials :-
            </label>
            <input
              name="companyInitials"
              type="text"
              required
              maxLength={2}
              value={formData.companyInitials}
              onChange={handleChange}
              className="w-full rounded-xl py-2.5 px-4 text-sm uppercase transition-all"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--color-white)",
              }}
              placeholder="e.g. OI"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Admin Name :-
            </label>
            <div className="relative group">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 px-4 text-sm transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Email :-
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 px-4 text-sm transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Phone :-
            </label>
            <div className="relative group">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 px-4 text-sm transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Password :-
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm transition-all"
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-slate-500)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider ml-1"
              style={{ color: "var(--color-slate-400)" }}
            >
              Confirm :-
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-slate-500)" }}
              />
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--color-white)",
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-widest"
            style={{
              background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
              color: "var(--color-white)",
            }}
          >
            {loading ? (
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderTopColor: "var(--color-white)",
                }}
              />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--color-slate-400)" }}>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--color-teal-400)" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
