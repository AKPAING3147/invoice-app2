"use client";

import { create } from "zustand";

type AuthState = {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null,

  isLoggedIn: typeof window !== "undefined"
    ? !!localStorage.getItem("token")
    : false,

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isLoggedIn: false });
  },
}));
