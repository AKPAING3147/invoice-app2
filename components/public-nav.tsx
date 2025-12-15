"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b px-6 bg-background">
            <div className="flex items-center gap-2 font-bold text-lg">
                <Link href="/">InventoryApp</Link>
            </div>
            <nav className="flex gap-4">
                <Link href="/login">
                    <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                    <Button>Sign Up</Button>
                </Link>
            </nav>
        </header>
    );
}
