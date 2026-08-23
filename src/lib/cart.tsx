import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MENU, type Dish } from "./menu";

export type CartLine = { id: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
  count: number;
  subtotal: number;
  detailed: { dish: Dish; qty: number }[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  openCart: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "msdelight-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const detailed = lines
      .map((l) => ({ dish: MENU.find((d) => d.id === l.id)!, qty: l.qty }))
      .filter((l) => Boolean(l.dish));

    return {
      lines,
      detailed,
      add: (id) =>
        setLines((prev) =>
          prev.some((l) => l.id === id)
            ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
            : [...prev, { id, qty: 1 }],
        ),
      remove: (id) =>
        setLines((prev) =>
          prev
            .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
            .filter((l) => l.qty > 0),
        ),
      clear: () => setLines([]),
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty ?? 0,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: detailed.reduce((s, l) => s + l.dish.price * l.qty, 0),
    };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
