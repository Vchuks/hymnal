// store/authStore.ts
import { LoginResponse } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface EachAdmin {
  _id: string;
  username: string;
  password: string;
}
interface AuthState {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  logout: () => void;
  isAdminModalOpen: boolean;
  modalMode: "update";
  openUpdateModal: (admin: EachAdmin) => void;
  openAdmin: () => void;
  closeAdmin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Set initial values cleanly to match the server state
      user: null,

      setUser: (user) => {
        if (user) {
          set({ user });
        } else {
          get().logout();
        }
      },
      isAdminModalOpen: false,
      modalMode: "update",
      openUpdateModal: () =>
        set({
          isAdminModalOpen: true,
          modalMode: "update",
        }),
      openAdmin: () => set({ isAdminModalOpen: true }),
      closeAdmin: () => set({ isAdminModalOpen: false }),
      logout: () => {
        localStorage.removeItem("token"); // Clean up other storage keys
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // The key name inside your localStorage
    },
  ),
);
