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
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product
} from "@/app/service/product";
import {
    Category,
    fetchCategories,
    createCategory,
    deleteCategory
} from "@/app/service/category";

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    // We only track fields that the API seems to support based on the collection
    const [formData, setFormData] = useState({
        product_name: "",
        price: 0,
        stock: 0,
        image: "" as string | null,
        categoryId: "" as string | number,
    });

    const loadProducts = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchProducts(token);
            const cats = await fetchCategories(token);
            const products = Array.isArray(data) ? data : data.data || [];
            setInventory(products);
            setCategories(Array.isArray(cats) ? cats : []);
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
        setFormData({ product_name: "", price: 0, stock: 0, image: null, categoryId: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (item: Product) => {
        setEditingItem(item);
        setFormData({
            product_name: item.product_name,
            price: item.price,
            stock: item.stock || 0,
            image: item.image || null,
            categoryId: item.categoryId || "",
        });
        setIsModalOpen(true);
    };

    const handleAddCategory = async () => {
        if (!newCatName.trim() || !token) return;
        try {
            const newCat = await createCategory(token, newCatName);
            setCategories([...categories, newCat]);
            setNewCatName("");
            toast.success(t.created_success);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!token || !window.confirm(t.delete_cat_confirm)) return;
        try {
            await deleteCategory(token, id);
            setCategories(categories.filter(c => c.id !== id));
            toast.success(t.deleted_success);
            loadProducts(); // Refresh products as their category might be nullified
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // ... (rest of the state and loadProducts function)

    // Modified handleDelete to open modal
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!token || !deleteId) return;
        try {
            await deleteProduct(token, deleteId);
            setInventory((prev) => prev.filter((item) => item.id !== deleteId));
            toast.success(t.deleted_success);
        } catch (err: any) {
            toast.error(err.message || t.failed_delete);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId ? Number(formData.categoryId) : null
            };

            if (editingItem) {
                // Update
                const updated = await updateProduct(token, editingItem.id, payload);
                setInventory((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? updated.data || updated : item))
                );
            } else {
                // Create
                const created = await createProduct(token, payload);
                setInventory((prev) => [created.data || created, ...prev]);
            }
            setIsModalOpen(false);
            loadProducts(); // Refresh to be sure
            toast.success(editingItem ? t.updated_success : t.created_success);
        } catch (err: any) {
            toast.error(err.message || t.operation_failed);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-muted/20 font-sans">
            <Sidebar />

            {/* Main */}
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <MobileSidebar />
                        <h2 className="text-2xl font-bold">{t.inventory}</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsCatModalOpen(true)}>
                            {t.manage_categories}
                        </Button>
                        <Button className="flex items-center gap-2" onClick={handleAdd}>
                            <Icons.Plus className="h-4 w-4" /> {t.add_product}
                        </Button>
                    </div>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <Card>
                    <CardContent className="p-0 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left">{t.image}</th>
                                    <th className="p-4 text-left">{t.name}</th>
                                    <th className="p-4 text-left">{t.category}</th>
                                    <th className="p-4 text-left">{t.stock}</th>
                                    <th className="p-4 text-left">{t.price}</th>
                                    <th className="p-4 text-right">{t.action}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-4"><div className="h-10 w-10 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                                            <td className="p-4"><div className="h-8 w-16 bg-muted animate-pulse rounded ml-auto" /></td>
                                        </tr>
                                    ))
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
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {item.category?.name || "-"}
                                            </td>
                                            <td className="p-4">
                                                {item.stock === 0 ? <span className="text-red-500 font-medium">{t.out_of_stock}</span> : item.stock}
                                            </td>
                                            <td className="p-4">${Number(item.price).toFixed(2)}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                    <Icons.Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id)}>
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

                {/* Confirm Delete Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-sm p-4">
                            <CardHeader>
                                <CardTitle>{t.delete_confirm_title || "Confirm Delete"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{t.delete_confirm || "Are you sure you want to delete this item?"}</p>
                            </CardContent>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>{t.cancel}</Button>
                                <Button variant="destructive" onClick={confirmDelete}>{t.delete}</Button>
                            </div>
                        </Card>
                    </div>
                )}

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

                                        <Field>
                                            <FieldLabel>{t.category}</FieldLabel>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.categoryId}
                                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            >
                                                <option value="">{t.select_category}</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
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
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? "Saving..." : editingItem ? t.save : t.add}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}


                {/* Category Modal */}
                {isCatModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md p-4">
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle>{t.manage_categories}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsCatModalOpen(false)}>
                                    <Icons.X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={t.new_category}
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                    />
                                    <Button onClick={handleAddCategory}>{t.add}</Button>
                                </div>
                                <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                                    {categories.length === 0 ? <p className="p-4 text-center text-sm text-muted-foreground">Empty</p> :
                                        categories.map(c => (
                                            <div key={c.id} className="flex justify-between items-center p-3">
                                                <span>{c.name}</span>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(c.id)}>
                                                    <Icons.Trash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
