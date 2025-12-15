"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store/useAccountStore";
import { fetchVouchers, Voucher } from "@/app/service/voucher";

export function CustomerSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const [customers, setCustomers] = useState<{ name: string, email: string, total_spent: number, last_order: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const loadCustomers = async () => {
            setLoading(true);
            try {
                // We derive customers from vouchers since there is no dedicated customer API
                const data = await fetchVouchers(token);
                const vouchers: Voucher[] = Array.isArray(data) ? data : data.data || [];

                const customerMap = new Map<string, { name: string, email: string, total_spent: number, last_order: string }>();

                vouchers.forEach(v => {
                    const key = v.customer_email;
                    if (!customerMap.has(key)) {
                        customerMap.set(key, {
                            name: v.customer_name,
                            email: v.customer_email,
                            total_spent: 0,
                            last_order: v.sale_date
                        });
                    }
                    const customer = customerMap.get(key)!;
                    customer.total_spent += Number(v.net_total);
                    // simple logic for latest date
                    if (v.sale_date > customer.last_order) customer.last_order = v.sale_date;
                });

                setCustomers(Array.from(customerMap.values()));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, [token, router]);

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
            <Button variant="secondary" className="w-full">Customers</Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/profile")}>Settings</Button>
            <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>Logout</Button>
        </aside>

        <main className="flex-1 p-6 space-y-6">
            <h2 className="text-2xl font-bold">Customers</h2>
            <Card>
                <CardContent className="p-0 overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Total Spent</th>
                                <th className="p-4 text-left">Last Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, i) => (
                                <tr key={i} className="border-t hover:bg-muted/20">
                                    <td className="p-4 font-medium">{c.name}</td>
                                    <td className="p-4 text-muted-foreground">{c.email}</td>
                                    <td className="p-4">${c.total_spent.toFixed(2)}</td>
                                    <td className="p-4">{c.last_order}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </main>
    </div>
}
