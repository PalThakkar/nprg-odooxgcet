"use client";

import React, { useState } from "react";
import EmployeeCard from "@/components/EmployeeCard";
import EmployeeDetailTile from "@/components/EmployeeDetailTile";
import { Search as SearchIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Employee {
    id: string;
    name: string | null;
    loginId: string | null;
    status: string | null;
    avatarUrl?: string | null;
    email?: string | null;
    phone?: string | null;
    role?: {
        name: string;
    } | null;
}

export default function EmployeeGrid({
    initialEmployees,
    viewerRole,
}: {
    initialEmployees: Employee[];
    viewerRole?: string | null;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );

    const filteredEmployees = initialEmployees.filter((employee: Employee) => {
        const name = (employee.name || employee.loginId || "").toLowerCase();
        const role = (employee.role?.name || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || role.includes(query);
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Employee Directory
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage and view all company members
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            className="gap-2 h-10 px-4 rounded-xl shadow-sm transition-all active:scale-95"
                            style={{
                                background: `linear-gradient(to right, var(--color-teal-600), var(--color-emerald-600))`,
                                color: "var(--color-white)",
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>NEW</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm transition-shadow focus-within:shadow-md">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by name, role or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 focus:ring-0 text-sm placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredEmployees.map((employee: Employee) => (
                    <EmployeeCard
                        key={employee.id}
                        name={employee.name || employee.loginId || "Unknown"}
                        role={employee.role?.name || "Employee"}
                        avatarUrl={employee.avatarUrl || undefined}
                        status={(employee.status || "absent") as any}
                        onClick={() => setSelectedEmployee(employee)}
                    />
                ))}

                {filteredEmployees.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No results found</p>
                        <p className="text-gray-400 text-sm">
                            No employees match "{searchQuery}"
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-4"
                            style={{ color: "var(--color-teal-500)" }}
                            onClick={() => setSearchQuery("")}
                        >
                            Clear search
                        </Button>
                    </div>
                )}
            </div>

            {/* Floating Tile */}
            {selectedEmployee && (
                <EmployeeDetailTile
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    viewerRole={viewerRole}
                />
            )}
        </div>
    );
}

