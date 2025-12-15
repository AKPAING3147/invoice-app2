import { API_URL } from "./config";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
}

export const getUserProfile = async (token: string) => {
    const res = await fetch(`${API_URL}/user-profile/show`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch profile");
    }

    return res.json();
};

export const changePassword = async (token: string, data: any) => {
    // data: { old_password, new_password, new_password_confirmation }
    const urlEncoded = new URLSearchParams();
    urlEncoded.append("old_password", data.old_password);
    urlEncoded.append("new_password", data.new_password);
    urlEncoded.append("new_password_confirmation", data.new_password_confirmation);

    const res = await fetch(`${API_URL}/user-profile/change-password`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded" // Postman uses urlencoded
        },
        body: urlEncoded.toString(),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change password");
    }

    return res.json();
};

export const changeName = async (token: string, name: string) => {
    const urlEncoded = new URLSearchParams();
    urlEncoded.append("name", name);

    const res = await fetch(`${API_URL}/user-profile/change-name`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlEncoded.toString(),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change name");
    }

    return res.json();
};

export const changeProfileImage = async (token: string, imageFile: File) => {
    // The Postman example for change-profile-image uses RAW JSON with filename "hello.jpg".
    // This is weird for an image upload. 
    // Usually it should be FormData.
    // However, the media/store endpoint uses FormData.
    // The user-profile/change-profile-image example in Postman has BODY RAW JSON: { "profile_image": "hello.jpg" }.
    // This implies we might be sending a path or a base64, or the Postman example is misleading.
    // OR maybe we upload to /media first, get a URL/name, and then update profile with that name.
    // Let's assume we might need to handle it carefully.
    // For now, I'll follow the pattern of sending JSON if it's a string, or figure out if we need to upload.

    // If I look at the media store request:
    // Body: form-data, key: image, type: file
    // Response: ??? (Presumably returns a path or ID)

    // If I look at media destroy:
    // URL: .../media/GqKkk...jpg

    // So likely workflow: Upload to media -> Get name -> Update profile with name.

    // I will implement a `uploadMedia` function if needed, but for now let's just stick to what the user asked (Profile API).
    // I will assume `changeProfileImage` takes a string (image path/name).

    throw new Error("Image upload workflow requires clarification. Please use media upload first.");
};

export const logoutApi = async (token: string) => { // Renamed to avoid conflict
    const res = await fetch(`${API_URL}/user-profile/logout`, {
        method: "PATCH", // Postman says PATCH for logout
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    // returns empty or message
    return res.ok;
}
