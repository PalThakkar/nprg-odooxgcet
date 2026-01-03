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
    <div className="min-h-screen text-foreground">
      <div className="home-bg"></div>
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary transition-all duration-300 group-hover:scale-105">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                Dayflow HRMS
              </h1>
              <p className="text-xs font-medium text-muted-foreground">
                Human Resource Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-md hover:shadow-primary/10">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground transition-all duration-300 hover:scale-105">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground hover:text-primary transition-colors duration-300">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      Logged in
                    </p>
                  </div>
                </div>
                <Link
                  href={
                    user.role === "admin" ? "/admin/employees" : "/employees"
                  }
                >
                  <Button className="btn-primary font-bold rounded-xl">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="btn-secondary font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-primary font-bold rounded-xl">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold text-foreground">
              Modern HR Platform for Growing Teams
            </span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-black tracking-tight">
            Manage Your Workforce{" "}
            <span className="gradient-text">Effortlessly</span>
          </h2>

          <p className="text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed text-muted-foreground">
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
                className="btn-primary h-14 px-8 rounded-2xl font-bold text-base group"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="btn-secondary h-14 px-8 rounded-2xl font-bold text-base"
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
          <h3 className="text-3xl lg:text-4xl font-black mb-4 text-foreground">
            Everything You Need to Manage HR
          </h3>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools designed for modern workforce management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden card-gradient rounded-3xl border border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 relative z-10">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Icon and Title side by side */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/25">
                    <feature.icon
                      className="w-8 h-8 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                    />
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 scale-100 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500" />
                  </div>
                  
                  {/* Title beside icon */}
                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight flex-1">
                    {feature.title}
                  </h4>
                </div>

                {/* Description below both */}
                <p className="leading-relaxed text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Subtle bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="card-gradient rounded-[40px] p-12 lg:p-20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black mb-2 gradient-text">
                99.9%
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Uptime SLA
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black mb-2 gradient-text">
                500+
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Companies Trust Us
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black mb-2 gradient-text">
                50K+
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Active Employees
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black mb-2 gradient-text">
                24/7
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 pb-32">
        <div className="card-gradient rounded-[40px] p-12 lg:p-20 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <h3 className="text-3xl lg:text-5xl font-black mb-6 gradient-text">
            Ready to Transform Your HR?
          </h3>
          <p className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto text-muted-foreground opacity-90">
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
              className="btn-primary h-14 px-10 rounded-2xl font-bold text-base"
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Get Started Now - It's Free"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users className="w-5 h-5 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                Dayflow HRMS
              </span>
            </div>
            <p className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              © 2026 Dayflow HRMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
