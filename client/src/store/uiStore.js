import { create } from "zustand";

export const useUIStore = create((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  quickOrderProduct: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  setQuickOrderProduct: (product) => set({ quickOrderProduct: product }),
}));
