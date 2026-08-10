import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as cartApi from "../api/cart";
import type { ItemCarrinho } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  items: ItemCarrinho[];
  total: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (
    produtoId: number,
    quantidade: number,
    variacaoProdutoId?: number,
  ) => Promise<void>;
  updateItem: (id: number, quantidade: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.findMine();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(
    produtoId: number,
    quantidade: number,
    variacaoProdutoId?: number,
  ) {
    await cartApi.add(produtoId, quantidade, variacaoProdutoId);
    await refresh();
  }

  async function updateItem(id: number, quantidade: number) {
    await cartApi.updateQuantity(id, quantidade);
    await refresh();
  }

  async function removeItem(id: number) {
    await cartApi.remove(id);
    await refresh();
  }

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.produto.preco) * item.quantidade,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({ items, total, loading, refresh, addItem, updateItem, removeItem }),
    [items, total, loading, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
