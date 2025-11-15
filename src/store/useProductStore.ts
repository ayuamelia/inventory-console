import { create } from "zustand";
import type { Product } from "../lib/api";

interface ProductState {
  items: Product[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error?: string;
  reset: () => void;
  appendPage: (newItems: Product[], page: number, limit: number) => void;
  addItem: (product: Product) => void;
  updateItem: (product: Product) => void;
  removeItem: (id: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  items: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: undefined,

  reset: () =>
    set({
      items: [],
      page: 1,
      hasMore: true,
      loading: false,
      error: undefined,
    }),

  appendPage: (newItems, page, limit) =>
    set((state) => ({
      items: [...state.items, ...newItems],
      page,
      hasMore: newItems.length === limit,
    })),

  addItem: (product) =>
    set((state) => ({
      items: [product, ...state.items],
    })),

  updateItem: (product) =>
    set((state) => ({
      items: state.items.map((p) =>
        p.id === product.id ? { ...p, ...product } : p
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== id),
    })),
}));