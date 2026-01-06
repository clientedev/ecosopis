import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => {
        const existing = state.items.find((i) => i.id === product.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i.id !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i
        ).filter(i => i.quantity > 0),
      })),
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((acc, item) => acc + (item.preco * item.quantity), 0);
      },
    }),
    { name: "ecosopis-cart" }
  )
);
