"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/useAccountStore";
import { getUserProfile, changeName, changePassword, UserProfile } from "@/app/service/user";

export function ProfileSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    // Forms
    const [name, setName] = useState("");
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "", new_password_confirmation: "" });

    useEffect(() => {
        if (token) {
            loadProfile();
        } else {
            router.push("/login");
        }
    }, [token]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await getUserProfile(token!);
            setProfile(data.data || data); // handle wrapper
            setName((data.data || data).name);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleUpdateName = async () => {
        try {
            await changeName(token!, name);
            alert("Name updated!");
            loadProfile();
        } catch (e: any) { alert(e.message); }
    };

    const handleUpdatePassword = async () => {
        try {
            await changePassword(token!, passwords);
            alert("Password updated! Please login again.");
            logout();
            router.push("/login");
        } catch (e: any) { alert(e.message); }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return <div className="flex h-screen bg-muted/20 font-sans">
        <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 space-y-4">
            <h1 className="font-bold text-lg">InventoryApp</h1>
            <Button variant="secondary" className="w-full" onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/product")}>Inventory</Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/voucher")}>Orders</Button>
            <Button variant="secondary" className="w-full">Settings</Button>
            <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>Logout</Button>
        </aside>

        <main className="flex-1 p-6 space-y-6">
            <h2 className="text-2xl font-bold">Profile & Settings</h2>

            {/* Profile Info */}
            <Card>
                <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold">
                            {profile?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{profile?.name}</p>
                            <p className="text-muted-foreground">{profile?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Name */}
            <Card>
                <CardHeader><CardTitle>Update Name</CardTitle></CardHeader>
                <CardContent className="space-y-4 max-w-md">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                    <Button onClick={handleUpdateName}>Save Name</Button>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent className="space-y-4 max-w-md">
                    <Input type="password" placeholder="Old Password" value={passwords.old_password} onChange={e => setPasswords({ ...passwords, old_password: e.target.value })} />
                    <Input type="password" placeholder="New Password" value={passwords.new_password} onChange={e => setPasswords({ ...passwords, new_password: e.target.value })} />
                    <Input type="password" placeholder="Confirm New Password" value={passwords.new_password_confirmation} onChange={e => setPasswords({ ...passwords, new_password_confirmation: e.target.value })} />
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                </CardContent>
            </Card>
        </main>
    </div>
}
