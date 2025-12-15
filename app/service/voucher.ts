import { API_URL } from "./config";

export interface VoucherRecord {
    product_id: number;
    quantity: number;
    created_at?: string;
}

export interface CreateVoucherPayload {
    voucher_id: string; // The user seems to provide this or is it auto-generated? Postman example shows providing it.
    customer_name: string;
    customer_email: string;
    sale_date: string;
    records: VoucherRecord[];
    total: number;
    tax: number;
    net_total: number;
}

export interface Voucher {
    id: number;
    voucher_id: string;
    customer_name: string;
    customer_email: string;
    sale_date: string;
    total: number;
    tax: number;
    net_total: number;
    records: any[]; // Define more specifically if needed
    created_at: string;
    updated_at: string;
}

export const fetchVouchers = async (token: string, params: any = {}) => {
    const query = new URLSearchParams(params);

    const res = await fetch(`${API_URL}/vouchers?${query.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch vouchers");
    }

    return res.json();
};

export const getVoucher = async (token: string, id: number | string) => {
    const res = await fetch(`${API_URL}/vouchers/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch voucher");
    }

    return res.json();
};

export const createVoucher = async (token: string, data: CreateVoucherPayload) => {
    const res = await fetch(`${API_URL}/vouchers`, {
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
        throw new Error(errorData.message || "Failed to create voucher");
    }

    return res.json();
};

export const deleteVoucher = async (token: string, id: number | string) => {
    const res = await fetch(`${API_URL}/vouchers/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete voucher");
    }

    return res.json();
};
