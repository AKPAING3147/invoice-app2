"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/useAccountStore";
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LayoutDashboard, Package, ShoppingCart, Users, User, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function SidebarContent() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthStore();
    const { language } = useLanguageStore();
    const t = translations[language];

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const navItems = [
        { label: t.dashboard, path: "/dashboard", icon: LayoutDashboard },
        { label: t.inventory, path: "/product", icon: Package },
        { label: t.orders, path: "/voucher", icon: ShoppingCart },
        { label: t.customers, path: "/customer", icon: Users },
        { label: t.profile, path: "/profile", icon: User },
        { label: t.settings, path: "/settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            <h1 className="font-bold text-lg px-2">{t.app_name}</h1>
            <div className="space-y-1">
                {navItems.map((item) => (
                    <Button
                        key={item.path}
                        variant={pathname === item.path ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => router.push(item.path)}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Button>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-auto gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t.logout}
            </Button>
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 h-full">
            <SidebarContent />
        </aside>
    );
}



export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
                <SidebarContent />
            </SheetContent>
        </Sheet>
    );
}
