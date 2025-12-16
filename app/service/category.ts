export interface Category {
    id: number;
    name: string;
}

export async function fetchCategories(token: string) {
    const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function createCategory(token: string, name: string) {
    const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
}

export async function deleteCategory(token: string, id: number) {
    const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
}
