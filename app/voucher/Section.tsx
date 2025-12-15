"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/useAccountStore";
import { fetchVouchers, createVoucher, deleteVoucher, Voucher } from "@/app/service/voucher";
import { fetchProducts, Product } from "@/app/service/product"; // Needed for sale creation

// reuse Icons or import
const Icons = {
    Plus: ({ className }: any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>,
    Trash: ({ className }: any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg>,
    X: ({ className }: any) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
};

export function VoucherSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Create form state
    const [saleData, setSaleData] = useState({
        customer_name: "",
        customer_email: "",
        sale_date: new Date().toISOString().split('T')[0],
        items: [] as { product_id: number; quantity: number }[]
    });

    useEffect(() => {
        if (token) {
            loadVouchers();
            loadProducts();
        } else {
            router.push("/login");
        }
    }, [token]);

    const loadVouchers = async () => {
        setLoading(true);
        try {
            const data = await fetchVouchers(token!);
            setVouchers(data.data || data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await fetchProducts(token!);
            setProducts(data.data || data);
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleCreate = async () => {
        try {
            // Calculate totals locally for the request
            // In a real app, backend might do this, but the API requires total, tax, net_total in payload? 
            // The Postman `store` payload HAS total, tax, net_total.
            // So we must calculate it.

            let total = 0;
            saleData.items.forEach(item => {
                const product = products.find(p => p.id === item.product_id);
                if (product) {
                    total += Number(product.price) * item.quantity;
                }
            });
            const tax = total * 0.07; // Assume 7% tax? Or 0? Postman example shows tax.
            // Let's assume some tax logic or just 0 for now if not specified. 
            // Postman: total 10600, tax 742 ~ 7%.

            const net_total = total + tax;

            await createVoucher(token!, {
                voucher_id: `INV-${Math.floor(Math.random() * 10000)}`, // Generate ID
                customer_name: saleData.customer_name,
                customer_email: saleData.customer_email,
                sale_date: saleData.sale_date,
                records: saleData.items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
                total,
                tax,
                net_total
            });
            setIsModalOpen(false);
            loadVouchers();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Delete this voucher?")) {
            await deleteVoucher(token!, id);
            loadVouchers();
        }
    }

    // ... Render code ...
    return <div className="flex h-screen bg-muted/20 font-sans">
        <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 space-y-4">
            <h1 className="font-bold text-lg">InventoryApp</h1>
            <Button variant="secondary" className="w-full" onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/product")}>Inventory</Button>
            <Button variant="secondary" className="w-full">Orders</Button>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/profile")}>Settings</Button>
            <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>Logout</Button>
        </aside>

        <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Orders / Vouchers</h2>
                <Button onClick={() => setIsModalOpen(true)}>Create Sale</Button>
            </div>

            {/* Table code */}
            <Card>
                <CardContent>
                    {/* List Vouchers */}
                    <table className="w-full">
                        <thead>
                            <tr className="text-left font-bold">
                                <th className="p-2">Voucher ID</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Net Total</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map(v => (
                                <tr key={v.id} className="border-t">
                                    <td className="p-2">{v.voucher_id}</td>
                                    <td className="p-2">{v.customer_name}</td>
                                    <td className="p-2">{Number(v.net_total).toFixed(2)}</td>
                                    <td className="p-2">{v.sale_date}</td>
                                    <td className="p-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)}><Icons.Trash className="w-4 h-4 text-red-500" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Modal for Create Sale */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl p-4 max-h-[90vh] overflow-auto">
                        <CardHeader><CardTitle>Create Sale</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Customer Name" value={saleData.customer_name} onChange={e => setSaleData({ ...saleData, customer_name: e.target.value })} />
                            <Input placeholder="Customer Email" value={saleData.customer_email} onChange={e => setSaleData({ ...saleData, customer_email: e.target.value })} />
                            <Input type="date" value={saleData.sale_date} onChange={e => setSaleData({ ...saleData, sale_date: e.target.value })} />

                            <div className="border p-4 rounded">
                                <h3 className="font-bold mb-2">Items</h3>
                                {saleData.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <select
                                            className="border p-2 rounded flex-1"
                                            value={item.product_id}
                                            onChange={e => {
                                                const newItems = [...saleData.items];
                                                newItems[idx].product_id = Number(e.target.value);
                                                setSaleData({ ...saleData, items: newItems });
                                            }}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.product_name} (${p.price})</option>)}
                                        </select>
                                        <Input
                                            type="number"
                                            className="w-24"
                                            value={item.quantity}
                                            placeholder="Qty"
                                            onChange={e => {
                                                const newItems = [...saleData.items];
                                                newItems[idx].quantity = Number(e.target.value);
                                                setSaleData({ ...saleData, items: newItems });
                                            }}
                                        />
                                        <Button variant="ghost" onClick={() => {
                                            const newItems = saleData.items.filter((_, i) => i !== idx);
                                            setSaleData({ ...saleData, items: newItems });
                                        }}>Remove</Button>
                                    </div>
                                ))}
                                <Button size="sm" onClick={() => setSaleData({ ...saleData, items: [...saleData.items, { product_id: 0, quantity: 1 }] })}>Add Item</Button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Create</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    </div>
}
