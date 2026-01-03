"use client";

import React, { useState, useEffect } from "react";
import AddEmployeeForm from "@/components/admin/AddEmployeeForm";
import EmployeeDetailTile from "@/components/EmployeeDetailTile";
import {
  Users,
  Plus,
  LayoutGrid,
  List,
  Search as SearchIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Employee {
  id: string;
  name: string;
  email: string;
  loginId: string;
  role: { name: string };
  status: string;
  avatarUrl?: string;
}

export default function EmployeeList() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/admin/employees');
            console.log('Response status:', res.status);
            const data = await res.json();
            console.log('Fetch Employees Data:', data);
            if (!res.ok) {
                console.error('API Error:', data.error || data);
            }
            if (data.employees) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id !== user?.id && // Exclude current admin user
      ((emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.loginId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: "var(--primary)",
              boxShadow: "0 10px 15px -3px rgba(32, 229, 178, 0.1)",
            }}
          >
            <Users
              className="w-6 h-6"
              style={{ color: "var(--primary-foreground)" }}
            />
          </div>
          <div>
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Employee Hub
            </h1>
            <p
              className="font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              Manage your workforce at Odoo India
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            backgroundColor: isAdding ? "var(--card)" : "var(--primary)",
            color: isAdding ? "var(--foreground)" : "var(--primary-foreground)",
            border: isAdding ? `1px solid var(--border)` : "none",
          }}
          className="h-12 px-6 rounded-2xl font-bold transition-all active:scale-95 shadow-lg hover:opacity-90"
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Directory</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Register Employee</span>
            </div>
          )}
        </Button>
      </div>

      {isAdding ? (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
          <AddEmployeeForm
            onSuccess={() => {
              fetchEmployees();
              setIsAdding(false);
            }}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                style={
                  {
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    "--tw-ring-color": "var(--primary)",
                  } as React.CSSProperties & { "--tw-ring-color": string }
                }
                className="w-full rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:border-current transition-all outline-none text-sm shadow-sm border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div
              className="flex rounded-2xl p-1 shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--card)",
                border: `1px solid var(--border)`,
              }}
            >
              <button
                className="p-2.5 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className="p-2.5 rounded-xl transition-colors hover:opacity-80"
                style={{ color: "var(--muted-foreground)" }}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2
                className="w-10 h-10 animate-spin"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-medium animate-pulse"
                style={{ color: "var(--muted-foreground)" }}
              >
                Scanning workforce directory...
              </p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((emp) => (
                <Card
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                  className="rounded-3xl shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden relative border"
                >
                  <CardContent className="p-6">
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"
                      style={{
                        backgroundColor: "var(--primary)",
                        opacity: 0.05,
                      }}
                    />

                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl border-2 shadow-sm flex items-center justify-center font-black text-xl overflow-hidden group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: "var(--primary)",
                          borderColor: "var(--card)",
                          color: "var(--primary-foreground)",
                        }}
                      >
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          emp.name?.substring(0, 1).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shadow-sm shadow-current"
                            style={{
                              backgroundColor:
                                emp.status === "present"
                                  ? "var(--secondary)"
                                  : "var(--muted)",
                            }}
                          />
                          <p
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {emp.status || "Offline"}
                          </p>
                        </div>
                        <h3
                          className="font-bold transition-colors uppercase truncate max-w-[120px] group-hover:opacity-80"
                          style={{ color: "var(--foreground)" }}
                        >
                          {emp.name}
                        </h3>
                      </div>
                    </div>

                    <div
                      className="space-y-3 pt-4"
                      style={{ borderTop: `1px solid var(--border)` }}
                    >
                      <div
                        className="flex justify-between items-center p-2 rounded-xl"
                        style={{
                          backgroundColor: "var(--primary)",
                          opacity: 0.1,
                          border: `1px solid var(--border)`,
                        }}
                      >
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Employee ID
                        </span>
                        <span
                          className="text-xs font-mono font-black"
                          style={{ color: "var(--primary)" }}
                        >
                          {emp.loginId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "var(--border)" }}
                        >
                          <Users
                            className="w-3.5 h-3.5"
                            style={{ color: "var(--muted-foreground)" }}
                          />
                        </div>
                        <span
                          className="text-xs font-semibold capitalize"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {emp.role?.name || "Employee"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="rounded-[40px] border-2 border-dashed py-32 text-center animate-in zoom-in duration-500"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "var(--border)" }}
              >
                <SearchIcon
                  className="w-10 h-10"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Nobody found here
              </h3>
              <p
                className="max-w-sm mx-auto"
                style={{ color: "var(--muted-foreground)" }}
              >
                Try a different search term or register a new team member to
                populate the directory.
              </p>
              <Button
                variant="ghost"
                style={{ color: "var(--primary)" }}
                className="mt-6 hover:opacity-80 font-bold"
                onClick={() => setSearchQuery("")}
              >
                Clear current search
              </Button>
            </div>
          )}

          {/* Floating Tile */}
          {selectedEmployee && (
            <EmployeeDetailTile
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
              viewerRole="admin"
            />
          )}
        </div>
      )}
    </div>
  );
}
