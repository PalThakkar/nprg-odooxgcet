"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddEmployeeFormProps {
  onSuccess?: (employee: any) => void;
}

export default function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessData(null);

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create employee");
      }

      setSuccessData(data.user);
      setFormData({ name: "", email: "", phone: "", password: "" });
      if (onSuccess) onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div
        className="rounded-2xl p-8 border text-center animate-in zoom-in duration-300"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-emerald-500) 10%, transparent)",
          borderColor:
            "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-emerald-500) 20%, transparent)",
          }}
        >
          <CheckCircle2
            className="w-8 h-8"
            style={{ color: "var(--color-emerald-500)" }}
          />
        </div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: "var(--color-white)" }}
        >
          Employee Created!
        </h3>
        <p className="mb-6" style={{ color: "var(--color-slate-300)" }}>
          The employee has been added to the system successfully.
        </p>

        <div
          className="rounded-xl p-4 border text-left space-y-3 mb-6 shadow-sm"
          style={{
            backgroundColor: "var(--color-slate-900)",
            borderColor: "var(--color-slate-700)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--color-slate-400)" }}
          >
            Login Credentials
          </p>
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: "var(--color-slate-400)" }}>Login ID:</span>
            <span
              className="font-mono font-bold px-2 py-0.5 rounded text-base"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-teal-500) 20%, transparent)",
                color: "var(--color-teal-400)",
              }}
            >
              {successData.loginId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: "var(--color-slate-400)" }}>Email:</span>
            <span
              className="font-semibold"
              style={{ color: "var(--color-white)" }}
            >
              {successData.email}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setSuccessData(null)}
          className="w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--color-emerald-600), var(--color-teal-500))",
            color: "var(--color-white)",
          }}
        >
          Add Another Employee
        </Button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 shadow-sm border"
      style={{
        backgroundColor: "var(--color-slate-900)",
        borderColor: "var(--color-slate-700)",
      }}
    >
      <h2
        className="text-xl font-bold mb-6 flex items-center gap-2"
        style={{ color: "var(--color-white)" }}
      >
        <User className="w-5 h-5" style={{ color: "var(--color-teal-500)" }} />
        New Employee Registration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-slate-400)" }}
            />
            <Input
              id="name"
              placeholder="e.g. Johnathan Doe"
              className="pl-10"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-slate-400)" }}
            />
            <Input
              id="email"
              type="email"
              placeholder="johnathan@company.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-slate-400)" }}
            />
            <Input
              id="phone"
              placeholder="+91 98765 43210"
              className="pl-10"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Initial Password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-slate-400)" }}
            />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <p
            className="text-[10px] mt-1 italic"
            style={{ color: "var(--color-slate-400)" }}
          >
            * The login ID will be generated automatically based on the employee
            name.
          </p>
        </div>

        {error && (
          <div
            className="border rounded-xl p-3 flex items-start gap-3 animate-in fade-in duration-300"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-red-500) 10%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--color-red-500) 20%, transparent)",
            }}
          >
            <AlertCircle
              className="w-4 h-4 mt-0.5"
              style={{ color: "var(--color-red-500)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-red-500)" }}
            >
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-semibold shadow-lg transition-all active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-teal-600), var(--color-emerald-600))",
            color: "var(--color-white)",
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            "Create Employee Account"
          )}
        </Button>
      </form>
    </div>
  );
}
