import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId) => set((state) => {
        const existing = state.items.find(i => i.productId === productId);
        if (existing) {
          return {
            items: state.items.map(i => 
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { items: [...state.items, { productId, quantity: 1 }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "ecosopis-cart" }
  )
);

import { createContext, useContext } from "react";

const CartContext = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
