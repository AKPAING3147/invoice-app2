"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "w-full bg-background border-b border-gray-200 px-6 py-4 flex items-center justify-between",
        className
      )}
    >
      <div className="text-xl font-bold">
        <Link href="/">MyApp</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Create Account</Button>
        </Link>
      </div>
    </nav>
  );
}
