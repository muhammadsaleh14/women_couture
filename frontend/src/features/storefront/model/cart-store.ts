import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  lineId: string;
  productId: string;
  variantId: string;
  title: string;
  colorName: string;
  unitPrice: number;
  qty: number;
  imageUrl: string;
}

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId"> & { lineId?: string }) => void;
  setQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

function makeLineId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (payload) => {
        const lineId = payload.lineId ?? makeLineId(payload.productId, payload.variantId);
        const existing = get().lines.find((l) => l.lineId === lineId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.lineId === lineId ? { ...l, qty: l.qty + payload.qty } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              ...payload,
              lineId,
            },
          ],
        });
      },
      setQty: (lineId, qty) => {
        if (qty < 1) {
          get().removeLine(lineId);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.lineId === lineId ? { ...l, qty } : l,
          ),
        });
      },
      removeLine: (lineId) =>
        set({ lines: get().lines.filter((l) => l.lineId !== lineId) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "wc-cart" },
  ),
);
