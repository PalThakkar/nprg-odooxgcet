"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Plane, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmployeeStatus = "present" | "absent" | "on-leave";

interface EmployeeCardProps {
  name: string;
  role: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  onClick?: () => void;
}

const statusColors = {
  present: "bg-green-500",
  absent: "bg-yellow-500",
  "on-leave": "bg-blue-500",
};

const statusIcons = {
  present: MapPin,
  absent: Clock,
  "on-leave": Plane,
};

export default function EmployeeCard({
  name,
  role,
  status,
  avatarUrl,
  onClick,
}: EmployeeCardProps) {
  return (
    <Card
      className="group hover:shadow-md transition-all cursor-pointer overflow-hidden"
      style={{
        backgroundColor: "var(--color-slate-900)",
        borderColor: "var(--color-slate-700)",
      }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2 shadow-sm transition-transform group-hover:scale-105"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-teal-500) 10%, transparent)",
                borderColor: "var(--color-slate-800)",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  className="w-10 h-10"
                  style={{ color: "var(--color-teal-500)" }}
                />
              )}
            </div>
            <div
              className={cn(
                "absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 shadow-sm flex items-center justify-center",
                statusColors[status]
              )}
              style={{ borderColor: "var(--color-slate-900)" }}
            >
              {status === "on-leave" && (
                <Plane className="w-2.5 h-2.5 text-white" />
              )}
            </div>
          </div>

          <div>
            <h3
              className="font-semibold line-clamp-1"
              style={{ color: "var(--color-white)" }}
            >
              {name}
            </h3>
            <p
              className="text-sm capitalize"
              style={{ color: "var(--color-slate-400)" }}
            >
              {role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
