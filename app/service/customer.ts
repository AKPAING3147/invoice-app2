import { API_URL } from "./config";

export interface Customer {
    id?: number;
    name: string;
    email?: string;
    phone?: string;
    totalSpent?: number;
}

export const fetchCustomers = async (token: string) => {
    const res = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const createCustomer = async (token: string, data: Customer) => {
    const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};
