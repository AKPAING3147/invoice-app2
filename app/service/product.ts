import { API_URL } from "./config";

export interface Product {
    id: number;
    product_name: string;
    price: number;
    stock: number;
    photo: string | null;
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
    stock?: number; // Optional based on collection but good to have
    image?: File;
}

export interface UpdateProductData {
    product_name?: string;
    price?: number;
    stock?: number;
    image?: File;
}

export const fetchProducts = async (token: string, params: ProductParams = {}) => {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    if (params.q) query.append("q", params.q);
    if (params.sort_by) query.append("sort_by", params.sort_by);
    if (params.sort_direction) query.append("sort_direction", params.sort_direction);

    const res = await fetch(`${API_URL}/products?${query.toString()}`, {
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
    const res = await fetch(`${API_URL}/products/${id}`, {
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
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            product_name: data.product_name,
            price: data.price,
            stock: data.stock
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create product");
    }

    return res.json();
};

export const updateProduct = async (token: string, id: number | string, data: UpdateProductData) => {
    // The API seems to have separate endpoints for patching name/price, 
    // or a PUT for the whole resource. Let's try PUT first as per collection "update"

    const res = await fetch(`${API_URL}/products/${id}`, {
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
    const res = await fetch(`${API_URL}/products/${id}`, {
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
