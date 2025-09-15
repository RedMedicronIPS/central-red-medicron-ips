// src/shared/utils/profile.ts
export const getProfilePicUrl = (pic: string | null) => {
    if (!pic) return null;
    if (pic.startsWith("http")) return pic;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000" || 'http://152.200.161.234:8081/' ;
    return `${API_BASE_URL}${pic}`;
};