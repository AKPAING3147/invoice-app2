import { API_URL } from "./config";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
}

export const getUserProfile = async (token: string) => {
    // We use /dashboard to get the name for now.
    const res = await fetch(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    // Map userName to name for the UI
    return { ...data, name: data.userName };
};

export const changeName = async (token: string, name: string) => {
    // Placeholder: Implement API endpoint if needed.
    // For now, this limits the feature but prevents the crash.
    console.warn("Change Name API not implemented yet");
    throw new Error("Feature not implemented yet");
    // const res = await fetch(`${API_URL}/user/name`, { method: 'PUT', ... });
};

export const changePassword = async (token: string, passwords: any) => {
    // Placeholder
    console.warn("Change Password API not implemented yet");
    throw new Error("Feature not implemented yet");
};
