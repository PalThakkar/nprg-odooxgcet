"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (res.ok) {
                router.push("/auth/login");
                router.refresh(); // Clear any server component cache
            } else {
                console.error("Failed to logout");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            // Don't set loading back to false if successful to prevent flicker before redirect
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="text-sm font-medium transition-colors flex items-center gap-2"
            style={{ color: "var(--color-slate-400)" }}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
        </button>
    );
}
