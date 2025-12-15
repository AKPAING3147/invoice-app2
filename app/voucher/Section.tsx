"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/useAccountStore";
import { toast } from "sonner";
import { fetchVouchers, createVoucher, Voucher, VoucherItem } from "@/app/service/voucher";
import { fetchCustomers, Customer } from "@/app/service/customer";
import { fetchProducts, Product } from "@/app/service/product";

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

export function VoucherSection() {
    const router = useRouter();
    const { token, logout } = useAuthStore();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data for selection
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    const [cart, setCart] = useState<VoucherItem[]>([]);
    const [currentItemId, setCurrentItemId] = useState("");
    const [currentQty, setCurrentQty] = useState(1);
    const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [receiveDate, setReceiveDate] = useState<string>("");
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState(""); // Search Feature

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [vData, cData, pData] = await Promise.all([
                fetchVouchers(token),
                fetchCustomers(token),
                fetchProducts(token)
            ]);
            setVouchers(Array.isArray(vData) ? vData : []);
            setCustomers(Array.isArray(cData) ? cData : []);
            setProducts(Array.isArray(pData) ? pData : pData.data || []);
        } catch (err: any) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) router.push("/login");
        else loadData();
    }, [token, router]);

    const handleLogout = () => { logout(); router.push("/login"); };

    const addToCart = () => {
        const product = products.find(p => p.id.toString() === currentItemId);
        if (!product) return;

        const existing = cart.find(i => i.productId === product.id);
        if (existing) {
            // Update qty
            setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + currentQty, total: (i.quantity + currentQty) * i.price } : i));
        } else {
            setCart([...cart, {
                productId: product.id,
                name: product.product_name,
                price: Number(product.price),
                quantity: currentQty,
                total: Number(product.price) * currentQty
            }]);
        }
        setCurrentItemId("");
        setCurrentQty(1);
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(i => i.productId !== id));
    };

    const handleSave = async () => {
        if (!selectedCustomer || cart.length === 0) {
            toast.error("Please select a customer and add items");
            return;
        }

        const total = cart.reduce((acc, item) => acc + item.total, 0);
        const voucherNo = `V-${Date.now().toString().slice(-6)}`;
        const statusElement = document.getElementById("voucher-status") as HTMLSelectElement;
        const status = statusElement ? statusElement.value : "UNPAID";

        try {
            const newVoucher = await createVoucher(token!, {
                voucher_no: voucherNo,
                customerId: Number(selectedCustomer),
                total,
                items: cart,
                status,
                paidAmount,
                date: orderDate,
                receiveDate: receiveDate || undefined
            });
            setVouchers(prev => [newVoucher, ...prev]);
            setIsModalOpen(false);
            setCart([]);
            setSelectedCustomer("");
            setOrderDate(new Date().toISOString().slice(0, 10));
            setReceiveDate("");
            setPaidAmount(0);
            toast.success("Voucher created");
        } catch (err: any) {
            toast.error(err.message || "Failed to create voucher");
        }
    };

    const handlePrint = (voucher: Voucher) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Voucher ${voucher.voucher_no}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { font-size: 24px; text-align: center; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .total { font-weight: bold; text-align: right; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Voucher / Invoice</h1>
                    <div class="header">
                        <div>
                            <p><strong>Voucher:</strong> ${voucher.voucher_no}</p>
                            <p><strong>Date:</strong> ${voucher.date ? new Date(voucher.date).toLocaleDateString() : '-'}</p>
                            <p><strong>Receive Date:</strong> ${voucher.receiveDate ? new Date(voucher.receiveDate).toLocaleDateString() : '-'}</p>
                        </div>
                        <div>
                            <p><strong>Customer:</strong> ${(voucher as any).customer?.name || 'Customer #' + voucher.customerId}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr>
                        </thead>
                        <tbody>
                            ${voucher.items.map(i => `
                                <tr>
                                    <td>${i.name}</td>
                                    <td style="text-align:center">${i.quantity}</td>
                                    <td style="text-align:right">$${i.price.toFixed(2)}</td>
                                    <td style="text-align:right">$${i.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">
                        <p>Total: $${voucher.total.toFixed(2)}</p>
                        <p>Paid: ${(voucher.paidAmount || 0).toFixed(2)}</p>
                        <p>Balance: ${(voucher.total - (voucher.paidAmount || 0)).toFixed(2)}</p>
                        <p>Status: ${voucher.status || 'UNPAID'}</p>
                    </div>
                    <script>window.print();</script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const filteredVouchers = vouchers.filter(v =>
        v.voucher_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((v as any).customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 space-y-4">
                <h1 className="font-bold text-lg">InventoryApp</h1>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/product")}>Inventory</Button>
                <Button variant="secondary" className="w-full" onClick={() => router.push("/voucher")}>Orders</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/customer")}>Customers</Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/profile")}>Settings</Button>
                <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>Logout</Button>
            </aside>

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Orders / Vouchers</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search voucher or customer..."
                            className="border p-2 rounded w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                            <Icons.Plus className="h-4 w-4" /> Create Order
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">Voucher #</th>
                                    <th className="p-4 text-left">Customer</th>
                                    <th className="p-4 text-left">Order Date</th>
                                    <th className="p-4 text-left">Receive Date</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Total</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
                                ) : filteredVouchers.length === 0 ? (
                                    <tr><td colSpan={7} className="p-4 text-center">No orders found.</td></tr>
                                ) : (
                                    filteredVouchers.map((v) => (
                                        <tr key={v.id} className="border-t hover:bg-muted/20">
                                            <td className="p-4 font-medium">{v.voucher_no}</td>
                                            <td className="p-4">{(v as any).customer?.name || "Customer " + v.customerId}</td>
                                            <td className="p-4">{v.date ? new Date(v.date).toLocaleDateString() : "-"}</td>
                                            <td className="p-4">{v.receiveDate ? new Date(v.receiveDate).toLocaleDateString() : "-"}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'PAID' ? 'bg-green-100 text-green-800' : v.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {v.status || "UNPAID"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div>${Number(v.total).toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">Paid: ${(v.paidAmount || 0).toFixed(2)}</div>
                                            </td>
                                            <td className="p-4">
                                                <Button variant="outline" size="sm" onClick={() => handlePrint(v)}>Print</Button>
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
                        <Card className="w-full max-w-2xl p-4 flex flex-col max-h-[90vh]">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle>Create Order</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 overflow-y-auto flex-1">
                                {/* Customer Select */}
                                <div>
                                    <label className="text-sm font-medium">Customer</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={selectedCustomer}
                                        onChange={e => setSelectedCustomer(e.target.value)}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Order Date</label>
                                        <input
                                            type="date"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={orderDate}
                                            onChange={(e) => setOrderDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Receive Date</label>
                                        <input
                                            type="date"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={receiveDate}
                                            onChange={(e) => setReceiveDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Add Items */}
                                <div className="border border-dashed p-4 rounded-md space-y-4">
                                    <h4 className="font-medium text-sm">Add Products</h4>
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={currentItemId}
                                            onChange={e => setCurrentItemId(e.target.value)}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.product_name} (${p.price})</option>
                                            ))}
                                        </select>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={currentQty}
                                            onChange={e => setCurrentQty(Number(e.target.value))}
                                            min={1}
                                        />
                                        <Button type="button" onClick={addToCart}>Add</Button>
                                    </div>
                                </div>

                                {/* Cart List */}
                                <div className="border p-4 rounded-md">
                                    <h4 className="font-medium text-sm mb-2">Cart</h4>
                                    {cart.length === 0 ? <p className="text-sm text-muted-foreground">Empty</p> : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left">Item</th>
                                                    <th className="text-center">Qty</th>
                                                    <th className="text-right">Total</th>
                                                    <th className="w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map(item => (
                                                    <tr key={item.productId} className="border-b last:border-0">
                                                        <td className="py-2">{item.name}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-right">${item.total.toFixed(2)}</td>
                                                        <td className="text-right">
                                                            <button className="text-red-500 font-bold" onClick={() => removeFromCart(item.productId!)}>x</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="font-bold">
                                                    <td colSpan={2} className="pt-2 text-right">Grand Total:</td>
                                                    <td className="pt-2 text-right">${cart.reduce((a, b) => a + b.total, 0).toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <label className="text-sm font-medium">Paid Amount ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Payment Status</label>
                                        {/* Status is automatically calculated based on paid amount vs total, or manual override? User asked to "decide". Let's disable manual status if paid amount is logic? Or give user freedom. Let's keep dropdown but auto-select logic could be nice. For now, manual. */}
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            defaultValue="UNPAID"
                                            id="voucher-status"
                                        >
                                            <option value="UNPAID">Unpaid</option>
                                            <option value="PAID">Paid</option>
                                            <option value="PARTIAL">Partial</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <span className="font-bold">Remaining Balance: </span>
                                    ${(cart.reduce((a, b) => a + b.total, 0) - paidAmount).toFixed(2)}
                                </div>

                            </CardContent>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Create Order</Button>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
