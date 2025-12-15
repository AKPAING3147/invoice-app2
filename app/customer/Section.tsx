"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useAuthStore } from "@/app/store/useAccountStore";
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
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
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

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            const created = await createCustomer(token, formData);
            setCustomers(prev => [created, ...prev]);
            setIsModalOpen(false);
            setFormData({ name: "", email: "", phone: "" });
            toast.success("Customer added successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to create customer");
        }
    };

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 space-y-4">
                <h1 className="font-bold text-lg">InventoryApp</h1>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/product")}>Inventory</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/voucher")}>Orders</Button>
                <Button variant="secondary" className="w-full" onClick={() => router.push("/customer")}>Customers</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/profile")}>Settings</Button>
                <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>Logout</Button>
            </aside>

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Customers</h2>
                    <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Icons.Plus className="h-4 w-4" /> Add Customer
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-right">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                                ) : customers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center">No customers found.</td></tr>
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
                                <CardTitle>Add Customer</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <form onSubmit={handleSave}>
                                <CardContent className="space-y-4">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Name</FieldLabel>
                                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Email</FieldLabel>
                                            <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Phone</FieldLabel>
                                            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">save</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
