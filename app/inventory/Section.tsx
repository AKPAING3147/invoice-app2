"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useAuthStore } from "@/app/store/useAccountStore";
import { useLanguageStore } from "@/app/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { toast } from "sonner";
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
    const { language } = useLanguageStore();
    const t = translations[language];

    const [inventory, setInventory] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    // We only track fields that the API seems to support based on the collection
    const [formData, setFormData] = useState({
        product_name: "",
        price: 0,
        stock: 0,
        image: "" as string | null,
    });

    const loadProducts = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchProducts(token);
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

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ product_name: "", price: 0, stock: 0, image: null });
        setIsModalOpen(true);
    };

    const handleEdit = (item: Product) => {
        setEditingItem(item);
        setFormData({
            product_name: item.product_name,
            price: item.price,
            stock: item.stock || 0,
            image: item.image || null,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        if (window.confirm(t.delete_confirm)) {
            try {
                await deleteProduct(token, id);
                setInventory((prev) => prev.filter((item) => item.id !== id));
                toast.success(t.deleted_success);
            } catch (err: any) {
                toast.error(err.message || t.failed_delete);
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
            toast.success(editingItem ? t.updated_success : t.created_success);
        } catch (err: any) {
            toast.error(err.message || t.operation_failed);
        }
    };

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <Sidebar />

            {/* Main */}
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t.inventory}</h2>
                    <Button className="flex items-center gap-2" onClick={handleAdd}>
                        <Icons.Plus className="h-4 w-4" /> {t.add_product}
                    </Button>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">{t.image}</th>
                                    <th className="p-4 text-left">{t.name}</th>
                                    <th className="p-4 text-left">{t.stock}</th>
                                    <th className="p-4 text-left">{t.price}</th>
                                    <th className="p-4 text-right">{t.action}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-4 text-center">{t.loading}</td></tr>
                                ) : inventory.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center">{t.no_products}</td></tr>
                                ) : (
                                    inventory.map((item) => (
                                        <tr key={item.id} className="border-t hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.product_name} className="w-10 h-10 object-cover rounded" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">{t.no_img}</div>
                                                )}
                                            </td>
                                            <td className="p-4">{item.product_name}</td>
                                            <td className="p-4">
                                                {item.stock === 0 ? <span className="text-red-500 font-medium">{t.out_of_stock}</span> : item.stock}
                                            </td>
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
                                <CardTitle>{editingItem ? t.edit_product : t.add_product}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <form onSubmit={handleSave}>
                                <CardContent className="space-y-4">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="product_name">{t.product_name}</FieldLabel>
                                            <Input
                                                id="product_name"
                                                value={formData.product_name}
                                                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                                required
                                            />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="stock">{t.stock}</FieldLabel>
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
                                                <FieldLabel htmlFor="price">{t.price}</FieldLabel>
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
                                        <Field>
                                            <FieldLabel htmlFor="image">{t.image}</FieldLabel>
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({ ...formData, image: reader.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                                        {t.cancel}
                                    </Button>
                                    <Button type="submit">{editingItem ? t.save : t.add}</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
