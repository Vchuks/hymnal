// store/authStore.ts
import { LoginResponse } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // ✅ Hydrate from localStorage on app load
  user: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      get().logout();
    }
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
}));