"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/useAccountStore";
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { getUserProfile, changeName, changePassword, UserProfile } from "@/app/service/user";

export function ProfileSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const { language } = useLanguageStore();
    const t = translations[language];

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

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <Sidebar />
            <main className="flex-1 p-6 space-y-6">
                <h2 className="text-2xl font-bold">{t.my_profile}</h2>

                {/* Profile Info */}
                <Card>
                    <CardHeader><CardTitle>{t.my_profile}</CardTitle></CardHeader>
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
                    <CardHeader><CardTitle>{t.update_name}</CardTitle></CardHeader>
                    <CardContent className="space-y-4 max-w-md">
                        <label className="text-sm font-medium">{t.full_name}</label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.full_name} />
                        <Button onClick={handleUpdateName}>{t.save_name}</Button>
                    </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                    <CardHeader><CardTitle>{t.change_password}</CardTitle></CardHeader>
                    <CardContent className="space-y-4 max-w-md">
                        <label className="text-sm font-medium">{t.old_password}</label>
                        <Input type="password" placeholder={t.old_password} value={passwords.old_password} onChange={e => setPasswords({ ...passwords, old_password: e.target.value })} />

                        <label className="text-sm font-medium">{t.new_password}</label>
                        <Input type="password" placeholder={t.new_password} value={passwords.new_password} onChange={e => setPasswords({ ...passwords, new_password: e.target.value })} />

                        <label className="text-sm font-medium">{t.confirm_password}</label>
                        <Input type="password" placeholder={t.confirm_password} value={passwords.new_password_confirmation} onChange={e => setPasswords({ ...passwords, new_password_confirmation: e.target.value })} />

                        <Button onClick={handleUpdatePassword}>{t.save_password}</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
