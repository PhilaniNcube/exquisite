import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState } from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          // Create unique ID combining product and picture
          const itemId = `${newItem.product}-${newItem.picture}`;
          const existingItem = state.items.find(
            (item) => item.id === itemId
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + 1;
            return {
              items: state.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: newQuantity,
                      linePrice: item.priceAtPurchase * newQuantity,
                    }
                  : item
              ),
            };
          }

          const linePrice = newItem.priceAtPurchase * 1;
          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id: itemId,
                quantity: 1,
                linePrice,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity,
                        linePrice: item.priceAtPurchase * quantity,
                      }
                    : item
                ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.linePrice,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
