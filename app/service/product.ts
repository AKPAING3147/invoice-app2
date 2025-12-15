import { API_URL } from "./config";

export interface Product {
    id: number;
    product_name: string;
    price: number;
    stock: number;
    image: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductParams {
    limit?: number;
    page?: number;
    q?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
}

export interface CreateProductData {
    product_name: string;
    price: number;
    stock?: number;
    image?: string | null;
}

export interface UpdateProductData {
    product_name?: string;
    price?: number;
    stock?: number;
    image?: string | null;
}

export const fetchProducts = async (token: string, params: ProductParams = {}) => {
    // Params ignored for now in local API simple implementation
    const res = await fetch(`${API_URL}/inventory`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    return res.json();
};

export const getProduct = async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch product");
    }

    return res.json();
};

export const createProduct = async (token: string, data: CreateProductData) => {
    const res = await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create product");
    }

    return res.json();
};

export const updateProduct = async (token: string, id: number | string, data: UpdateProductData) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
    }

    return res.json();
};

export const deleteProduct = async (token: string, id: number | string) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
    }

    return res.json();
};


