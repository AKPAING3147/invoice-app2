"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/app/store/useAccountStore";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product
} from "@/app/service/product";

/* ---------------- ICONS ---------------- */
const Icons = {
    Plus: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    ),
    Edit: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
    ),
    Trash: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        </svg>
    ),
    X: ({ className }: React.SVGProps<SVGSVGElement>) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    ),
};

/* ---------------- COMPONENT ---------------- */
export function Inventory() {
    const router = useRouter();
    const { token, logout } = useAuthStore();

    const [inventory, setInventory] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    // We only track fields that the API seems to support based on the collection
    const [formData, setFormData] = useState({
        product_name: "",
        price: 0,
        stock: 0, // Assuming API might support it, otherwise it's local only
    });

    const loadProducts = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchProducts(token);
            // The API returns { data: [...] } or just [...]? 
            // Based on typical Laravel resources it might be { data: [...] }.
            // Let's assume it returns the array or check response structure. 
            // If data.data exists, use it, otherwise use data.
            const products = Array.isArray(data) ? data : data.data || [];
            setInventory(products);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else {
            loadProducts();
        }
    }, [token, router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ product_name: "", price: 0, stock: 0 });
        setIsModalOpen(true);
    };

    const handleEdit = (item: Product) => {
        setEditingItem(item);
        setFormData({
            product_name: item.product_name,
            price: item.price,
            stock: item.stock || 0,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteProduct(token, id);
                setInventory((prev) => prev.filter((item) => item.id !== id));
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            if (editingItem) {
                // Update
                const updated = await updateProduct(token, editingItem.id, formData);
                // If API returns the updated object
                setInventory((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? updated.data || updated : item))
                );
            } else {
                // Create
                const created = await createProduct(token, formData);
                setInventory((prev) => [created.data || created, ...prev]);
            }
            setIsModalOpen(false);
            loadProducts(); // Refresh to be sure
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Status helper removed as per request

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r hidden md:flex flex-col p-4 space-y-4">
                <h1 className="font-bold text-lg">InventoryApp</h1>
                <Button variant="secondary" className="w-full" onClick={() => router.push("/dashboard")}>
                    Dashboard
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/product")}>
                    Inventory
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/voucher")}>
                    Orders
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/customer")}>
                    Customers
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/profile")}>
                    Settings
                </Button>
                <Button variant="outline" className="w-full mt-auto" onClick={handleLogout}>
                    Logout
                </Button>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Inventory</h2>
                    <Button className="flex items-center gap-2" onClick={handleAdd}>
                        <Icons.Plus className="h-4 w-4" /> Add Product
                    </Button>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    {/* SKU/Category removed as API doesn't support them explicitly in this demo */}
                                    <th className="p-4 text-left">Stock</th>
                                    <th className="p-4 text-left">Price</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                                ) : inventory.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center">No products found.</td></tr>
                                ) : (
                                    inventory.map((item) => (
                                        <tr key={item.id} className="border-t hover:bg-muted/20 transition-colors">
                                            <td className="p-4">{item.product_name}</td>
                                            <td className="p-4">{item.stock}</td>
                                            <td className="p-4">${Number(item.price).toFixed(2)}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                    <Icons.Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                    <Icons.Trash className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-lg p-4">
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle>{editingItem ? "Edit Product" : "Add Product"}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <form onSubmit={handleSave}>
                                <CardContent className="space-y-4">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="product_name">Product Name</FieldLabel>
                                            <Input
                                                id="product_name"
                                                value={formData.product_name}
                                                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                                required
                                            />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Removed SKU and Category fields since they aren't in API */}
                                            <Field>
                                                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                                                <Input
                                                    id="stock"
                                                    type="text"
                                                    value={formData.stock}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            setFormData({ ...formData, stock: Number(val) });
                                                        }
                                                    }}
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                                <Input
                                                    id="price"
                                                    type="text"
                                                    value={formData.price}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(val)) {
                                                            setFormData({ ...formData, price: Number(val) });
                                                        }
                                                    }}
                                                    required
                                                />
                                            </Field>
                                        </div>
                                    </FieldGroup>
                                </CardContent>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">{editingItem ? "Save" : "Add"}</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

