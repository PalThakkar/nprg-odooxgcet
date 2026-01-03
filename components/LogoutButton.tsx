"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "var(--color-slate-400)" }}
        >
            Logout
        </button>
    );
}
