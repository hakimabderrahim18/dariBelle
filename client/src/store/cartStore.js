import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      selectedWilaya: null,
      shippingFee: 600, // default fee
      isDeskDelivery: false,

      addItem: (product, quantity = 1, variant = null) => {
        set((state) => {
          const variantSku = variant ? variant.sku : null;
          const price = variant
            ? variant.price
            : product.salePrice && product.salePrice < product.price
            ? product.salePrice
            : product.price;

          const existingIndex = state.items.findIndex(
            (item) => item.product === product._id && item.variantSku === variantSku
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          }

          const newItem = {
            product: product._id,
            name: product.name?.fr || product.name,
            nameAr: product.name?.ar || "",
            image: product.images?.[0] || "",
            price,
            quantity,
            variantSku,
            variantName: variant?.name || null,
            maxStock: variant ? variant.stock : product.stock,
            slug: product.slug,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, variantSku = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product === productId && item.variantSku === variantSku)
          ),
        }));
      },

      updateQuantity: (productId, variantSku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantSku);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product === productId && item.variantSku === variantSku
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      setCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      setSelectedWilaya: (wilayaObj, isDesk = false) => {
        if (!wilayaObj) {
          set({ selectedWilaya: null, shippingFee: 600 });
          return;
        }
        const fee = isDesk && wilayaObj.deskFee > 0 ? wilayaObj.deskFee : wilayaObj.fee;
        set({ selectedWilaya: wilayaObj, shippingFee: fee, isDeskDelivery: isDesk });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        const subtotal = get().getSubtotal();
        if (!coupon) return 0;
        if (coupon.type === "percent") {
          return Math.round((subtotal * coupon.value) / 100);
        }
        return coupon.discount || coupon.value || 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = subtotal >= 35000 ? 0 : get().shippingFee;
        const discount = get().getDiscount();
        return Math.max(0, subtotal + shipping - discount);
      },

      getItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "dari_belle_cart",
    }
  )
);
