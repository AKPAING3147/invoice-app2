"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAccountStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { token, isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else {
            setChecked(true);
        }
    }, [token, router]);

    if (!checked) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return <>{children}</>;
}
