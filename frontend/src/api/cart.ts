import { http } from "./http";
import type { ItemCarrinho, Produto, VariacaoProduto } from "../types";

interface CartItemResponse {
  id: number;
  userId: number;
  productId: number;
  variantProductId: number | null;
  quantity: number;
  createdAt: string;
  product?: Produto;
  variant?: VariacaoProduto | null;
}

interface CartResponse {
  items: CartItemResponse[];
  total: number;
}

function toItemCarrinho(item: CartItemResponse): ItemCarrinho {
  return {
    id: item.id,
    produtoId: item.productId,
    variacaoProdutoId: item.variantProductId,
    quantidade: item.quantity,
    produto: item.product as Produto,
    variacaoProduto: item.variant,
  };
}

export async function findMine() {
  const { data } = await http.get<CartResponse>("/cart");
  return data.items.map(toItemCarrinho);
}

export async function add(
  produtoId: number,
  quantidade: number,
  variacaoProdutoId?: number,
) {
  const { data } = await http.post<CartItemResponse>("/cart", {
    productId: produtoId,
    quantity: quantidade,
    variantId: variacaoProdutoId,
  });
  return toItemCarrinho(data);
}

export async function updateQuantity(id: number, quantidade: number) {
  const { data } = await http.patch<CartItemResponse>(`/cart/${id}`, {
    quantity: quantidade,
  });
  return toItemCarrinho(data);
}

export async function remove(id: number) {
  await http.delete(`/cart/${id}`);
}