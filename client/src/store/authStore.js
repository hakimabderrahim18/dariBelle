import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (e) {
          // ignore error
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updated) => {
        set((state) => ({ user: { ...state.user, ...updated } }));
      },
    }),
    {
      name: "dari_belle_auth",
    }
  )
);
