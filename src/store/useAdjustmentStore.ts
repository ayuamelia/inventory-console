import { create } from "zustand";
import type { Adjustment } from "../lib/api";

interface AdjustmentState {
  items: Adjustment[];
  page: number;
  hasMore: boolean;
  reset: () => void;
  setPage: (page: number) => void;
  setData: (items: Adjustment[], hasMore: boolean) => void;
  prepend: (item: Adjustment) => void;
  updateItem: (item: Adjustment) => void;
  removeItem: (id: number) => void;
}

export const useAdjustmentStore = create<AdjustmentState>((set) => ({
  items: [],
  page: 1,
  hasMore: true,

  reset: () =>
    set({
      items: [],
      page: 1,
      hasMore: true,
    }),

  setPage: (page) => set({ page }),

  setData: (items, hasMore) => set({ items, hasMore }),

  prepend: (item) =>
    set((state) => ({
      items: [item, ...state.items],
    })),

  updateItem: (item) =>
    set((state) => ({
      items: state.items.map((a) => (a.id === item.id ? { ...a, ...item } : a)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((a) => a.id !== id),
    })),
}));
