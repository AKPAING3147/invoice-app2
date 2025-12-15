import { API_URL } from "./config";

export interface VoucherItem {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Voucher {
    id?: number;
    voucher_no: string;
    customerId: number;
    display_id?: string;
    customer_name?: string; // Optional for display
    customer_email?: string; // Optional for display
    date?: string;
    receiveDate?: string;
    total: number;
    status?: string;
    paidAmount?: number;
    items: VoucherItem[];
}

export const fetchVouchers = async (token: string) => {
    const res = await fetch(`${API_URL}/vouchers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const createVoucher = async (token: string, data: Voucher) => {
    const res = await fetch(`${API_URL}/vouchers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};
