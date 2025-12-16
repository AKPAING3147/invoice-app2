"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store/useAccountStore";
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const t = translations[language];

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <Sidebar />
            <main className="flex-1 p-6 space-y-6">
                <h2 className="text-2xl font-bold">{t.settings}</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.language}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.select_language}</label>
                            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">{t.english}</SelectItem>
                                    <SelectItem value="mm">{t.burmese}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
