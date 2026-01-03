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
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Users
                className="w-6 h-6"
                style={{ color: "var(--primary-foreground)" }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-black tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                Dayflow HRMS
              </h1>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                Human Resource Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div
                  className="flex items-center gap-3 px-4 py-2 rounded-xl"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Logged in
                    </p>
                  </div>
                </div>
                <Link
                  href={
                    user.role === "admin" ? "/admin/employees" : "/employees"
                  }
                >
                  <Button
                    className="font-bold rounded-xl"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    className="font-bold rounded-xl"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="text-sm font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Modern HR Platform for Growing Teams
            </span>
          </div>

          <h2
            className="text-5xl lg:text-7xl font-black tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Manage Your Workforce{" "}
            <span style={{ color: "var(--primary)" }}>Effortlessly</span>
          </h2>

          <p
            className="text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Streamline employee management, attendance tracking, leave requests,
            and payroll processing in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href={
                isAuthenticated && user
                  ? user.role === "admin"
                    ? "/admin/employees"
                    : "/employees"
                  : "/auth/signup"
              }
            >
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl font-bold text-base group"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-2xl font-bold text-base"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-16">
          <h3
            className="text-3xl lg:text-4xl font-black mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Everything You Need to Manage HR
          </h3>
          <p className="text-lg" style={{ color: "var(--muted-foreground)" }}>
            Comprehensive tools designed for modern workforce management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-3xl border transition-all hover:shadow-lg group"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <CardContent className="p-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: "var(--secondary-foreground)" }}
                  />
                </div>
                <h4
                  className="text-xl font-bold mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  {feature.title}
                </h4>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div
          className="rounded-[40px] p-12 lg:p-20"
          style={{
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div
                className="text-4xl lg:text-5xl font-black mb-2"
                style={{ color: "var(--primary)" }}
              >
                99.9%
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Uptime SLA
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl lg:text-5xl font-black mb-2"
                style={{ color: "var(--primary)" }}
              >
                500+
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Companies Trust Us
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl lg:text-5xl font-black mb-2"
                style={{ color: "var(--primary)" }}
              >
                50K+
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Active Employees
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl lg:text-5xl font-black mb-2"
                style={{ color: "var(--primary)" }}
              >
                24/7
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 pb-32">
        <div
          className="rounded-[40px] p-12 lg:p-20 text-center"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <h3
            className="text-3xl lg:text-5xl font-black mb-6"
            style={{ color: "var(--primary-foreground)" }}
          >
            Ready to Transform Your HR?
          </h3>
          <p
            className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto opacity-90"
            style={{ color: "var(--primary-foreground)" }}
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
            <Button
              size="lg"
              className="h-14 px-10 rounded-2xl font-bold text-base"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--primary)",
              }}
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Get Started Now - It's Free"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-12"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: "var(--primary-foreground)" }}
                />
              </div>
              <span
                className="font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Dayflow HRMS
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              © 2026 Dayflow HRMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
