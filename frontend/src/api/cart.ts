import { http } from "./http";
import type { ItemCarrinho } from "../types";

export async function findMine() {
  const { data } = await http.get<ItemCarrinho[]>("/cart");
  return data;
}

export async function add(
  produtoId: number,
  quantidade: number,
  variacaoProdutoId?: number,
) {
  const { data } = await http.post<ItemCarrinho>("/cart", {
    produtoId,
    quantidade,
    variacaoProdutoId,
  });
  return data;
}

export async function updateQuantity(id: number, quantidade: number) {
  const { data } = await http.patch<ItemCarrinho>(`/cart/${id}`, {
    quantidade,
  });
  return data;
}

export async function remove(id: number) {
  await http.delete(`/cart/${id}`);
}
