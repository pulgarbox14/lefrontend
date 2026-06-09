// Panier d'achat : état global + persistance dans le navigateur.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "myshop.cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydratation depuis le navigateur (évite tout décalage SSR).
  useEffect(() => {
    setItems(loadCart());
  }, []);

  // Sauvegarde à chaque changement.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id
            ? { ...it, quantity: it.quantity + quantity }
            : it,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((it) => it.product.id !== productId)
        : prev.map((it) =>
            it.product.id === productId ? { ...it, quantity } : it,
          ),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, it) => sum + it.quantity, 0);
    const total = items.reduce(
      (sum, it) => sum + (Number(it.product.price) || 0) * it.quantity,
      0,
    );
    return { items, count, total, add, setQuantity, remove, clear };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.");
  }
  return ctx;
}
