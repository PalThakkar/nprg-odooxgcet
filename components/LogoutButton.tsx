"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton() {
    const router = useRouter();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Using context logout to ensure client state is cleared
            logout();
            router.push("/auth/login");
            // router.refresh(); // Optional: might be needed to clear server components
        } catch (error) {
            console.error("Error during logout:", error);
            setLoading(false);
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
