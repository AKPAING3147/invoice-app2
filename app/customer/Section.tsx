"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, MobileSidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useAuthStore } from "@/app/store/useAccountStore";
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { toast } from "sonner";
import { fetchCustomers, createCustomer, Customer } from "@/app/service/customer";

const Icons = {
    Plus: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    ),
    X: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    ),
};

export function CustomerSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const { language } = useLanguageStore();
    const t = translations[language];

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Customer>({ name: "", email: "", phone: "" });

    const loadCustomers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchCustomers(token);
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err: any) {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) router.push("/login");
        else loadCustomers();
    }, [token, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSaving(true);
        try {
            const created = await createCustomer(token, formData);
            setCustomers(prev => [created, ...prev]);
            setIsModalOpen(false);
            setFormData({ name: "", email: "", phone: "" });
            toast.success(t.customer_added);
        } catch (err: any) {
            toast.error(err.message || t.customer_create_fail);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <Sidebar />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <MobileSidebar />
                        <h2 className="text-2xl font-bold">{t.customers}</h2>
                    </div>
                    <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Icons.Plus className="h-4 w-4" /> {t.add_customer}
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">{t.name}</th>
                                    <th className="p-4 text-left">{t.email}</th>
                                    <th className="p-4 text-left">{t.phone}</th>
                                    <th className="p-4 text-right">{t.total_spent}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-4"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-40 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : customers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center">{t.no_customers}</td></tr>
                                ) : (
                                    customers.map((c) => (
                                        <tr key={c.id} className="border-t hover:bg-muted/20">
                                            <td className="p-4 font-medium">{c.name}</td>
                                            <td className="p-4">{c.email || "-"}</td>
                                            <td className="p-4">{c.phone || "-"}</td>
                                            <td className="p-4 text-right font-medium text-green-600">
                                                ${(c.totalSpent || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-lg p-4">
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle>{t.add_customer}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <form onSubmit={handleSave}>
                                <CardContent className="space-y-4">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>{t.name}</FieldLabel>
                                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </Field>
                                        <Field>
                                            <FieldLabel>{t.email}</FieldLabel>
                                            <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </Field>
                                        <Field>
                                            <FieldLabel>{t.phone}</FieldLabel>
                                            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>{t.cancel}</Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Saving..." : t.save}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
