"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: "var(--primary)" }}
          />
          <p
            className="font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Loading Dayflow HRMS...
          </p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Centralized employee database with comprehensive profiles and role-based access control.",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description:
        "Real-time attendance monitoring with automated check-in/check-out and history logs.",
    },
    {
      icon: Calendar,
      title: "Leave Management",
      description:
        "Streamlined leave requests, approvals, and balance tracking for all employees.",
    },
    {
      icon: DollarSign,
      title: "Payroll Processing",
      description:
        "Automated salary calculations with detailed breakdowns and payment history.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Comprehensive insights into workforce metrics and organizational performance.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with role-based permissions and audit trails.",
    },
  ];

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--foreground)",
      }}
    >
      {/* Background Grid Pattern */}
      <div className="auth-bg" />

      {/* Navigation */}
      <nav className="border-b-2 border-slate-700 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center border-2 border-primary bg-primary"
            >
              <Users
                className="w-6 h-6 text-slate-900"
              />
            </div>
            <div>
              <h1
                className="text-xl font-black tracking-tighter uppercase"
                style={{ color: "var(--foreground)" }}
              >
                Dayflow HRMS
              </h1>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--primary)" }}
              >
                Human Resource Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div
                  className="flex items-center gap-3 px-4 py-2 border-2 border-slate-700 bg-slate-800"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center font-bold text-sm bg-primary text-slate-900 border border-primary"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p
                      className="text-sm font-bold uppercase"
                      style={{ color: "var(--foreground)" }}
                    >
                      {user.name}
                    </p>
                  </div>
                </div>
                <Link
                  href={
                    user.role === "admin" ? "/admin/employees" : "/employees"
                  }
                >
                  <button className="btn-primary text-sm px-4 py-2">
                    Dashboard
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:block">
                  <button className="text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="btn-primary text-sm px-4 py-2">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32 relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="perspective-container">
          <div className="grid-3d"></div>
        </div>

        {/* Floating 3D Cubes */}
        <div className="floating-cube" style={{ top: "15%", left: "10%", animationDelay: "0s" }}>
          <div className="cube-face face-front"></div>
          <div className="cube-face face-back"></div>
          <div className="cube-face face-right"></div>
          <div className="cube-face face-left"></div>
          <div className="cube-face face-top"></div>
          <div className="cube-face face-bottom"></div>
        </div>

        <div className="floating-cube" style={{ bottom: "20%", right: "15%", animationDelay: "-7s" }}>
          <div className="cube-face face-front"></div>
          <div className="cube-face face-back"></div>
          <div className="cube-face face-right"></div>
          <div className="cube-face face-left"></div>
          <div className="cube-face face-top"></div>
          <div className="cube-face face-bottom"></div>
        </div>

        <div className="text-center max-w-5xl mx-auto space-y-8 relative z-10">
          <div
            className="inline-flex items-center gap-3 px-6 py-2 border-2 border-primary bg-slate-900 shadow-[4px_4px_0px_0px_var(--color-primary)] backdrop-blur-sm"
          >
            <div
              className="w-3 h-3 bg-primary animate-pulse"
            />
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--foreground)" }}
            >
              Modern HR Platform for Growing Teams
            </span>
          </div>

          <h2
            className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none"
            style={{
              color: "var(--foreground)",
              textShadow: "6px 6px 0px rgba(32, 229, 178, 0.4)"
            }}
          >
            Manage Your Workforce{" "}
            <span className="text-primary bg-slate-800 px-2 inline-block -skew-x-12 border-b-8 border-primary shadow-[4px_4px_0px_0px_white]">
              Effortlessly
            </span>
          </h2>

          <p
            className="text-xl lg:text-3xl max-w-3xl mx-auto leading-relaxed font-bold text-slate-300 drop-shadow-md"
          >
            Streamline employee management, attendance tracking, leave requests,
            and payroll processing in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
            <Link
              href={
                isAuthenticated && user
                  ? user.role === "admin"
                    ? "/admin/employees"
                    : "/employees"
                  : "/auth/signup"
              }
            >
              <button
                className="btn-3d-primary text-xl h-20 w-full sm:w-auto min-w-[240px]"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-6 h-6 ml-3 inline-block" />
              </button>
            </Link>
            <Link href="/auth/login">
              <button
                className="btn-3d-secondary text-xl h-20 w-full sm:w-auto min-w-[240px]"
              >
                Sign In to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t-2 border-slate-800">
        <div className="text-center mb-16">
          <h3
            className="text-3xl lg:text-5xl font-black mb-6 uppercase tracking-tight"
          >
            Everything You Need
          </h3>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive tools designed for modern workforce management. No fluff, just function.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="brutal-card p-8 group hover:-translate-y-2"
              >
                <div
                  className="w-16 h-16 flex items-center justify-center mb-6 border-2 border-slate-700 bg-slate-800 group-hover:bg-primary group-hover:border-primary transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                >
                  <feature.icon
                    className="w-8 h-8 text-primary group-hover:text-slate-900 transition-colors duration-300"
                  />
                </div>
                <h4
                  className="text-xl font-black mb-4 uppercase tracking-wide"
                  style={{ color: "var(--foreground)" }}
                >
                  {feature.title}
                </h4>
                <p
                  className="leading-relaxed text-slate-400 font-medium"
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div
          className="p-12 lg:p-20 bg-slate-900 border-2 border-primary shadow-[12px_12px_0px_0px_rgba(32,229,178,0.2)]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { val: "99.9%", label: "Uptime SLA" },
              { val: "500+", label: "Companies Trust Us" },
              { val: "50K+", label: "Active Employees" },
              { val: "24/7", label: "Support Available" }
            ].map((stat, i) => (
              <div key={i} className="text-center relative">
                <div
                  className="text-4xl lg:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400"
                  style={{ textShadow: "2px 2px 0px rgba(32, 229, 178, 0.5)" }}
                >
                  {stat.val}
                </div>
                <div
                  className="text-sm font-bold uppercase tracking-widest text-primary"
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 pb-32">
        <div
          className="p-12 lg:p-20 text-center bg-primary border-4 border-slate-900 shadow-[16px_16px_0px_0px_#0f0f1e]"
        >
          <h3
            className="text-4xl lg:text-6xl font-black mb-6 uppercase text-slate-900"
          >
            Ready to Transform Your HR?
          </h3>
          <p
            className="text-xl mb-12 max-w-2xl mx-auto font-bold text-slate-800"
          >
            Join hundreds of companies using Dayflow HRMS to streamline their
            human resource operations.
          </p>
          <Link
            href={
              isAuthenticated && user
                ? user.role === "admin"
                  ? "/admin/employees"
                  : "/employees"
                : "/auth/signup"
            }
          >
            <button
              className="h-16 px-12 font-black text-lg uppercase bg-slate-900 text-white border-2 border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-[8px_8px_0px_0px_#fff]"
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Get Started Now - It's Free"}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t-2 border-slate-800 py-12 bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 flex items-center justify-center bg-primary border-2 border-primary"
              >
                <Users
                  className="w-6 h-6 text-slate-900"
                />
              </div>
              <span
                className="font-black text-xl uppercase tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                Dayflow HRMS
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              © 2026 Dayflow HRMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
