import { http } from "./http";
import type { EstoqueItem, MovimentacaoEstoque } from "../types";

export interface StockApiItem {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  lowStock: boolean;
  variants: {
    id: number;
    size: string | null;
    color: string | null;
    stock: number;
  }[];
}

export function toEstoqueItem(item: StockApiItem): EstoqueItem {
  return {
    id: item.id,
    nome: item.name,
    estoque: item.stock,
    estoqueMinimo: item.minStock,
    estoqueBaixo: item.lowStock,
    variantes: item.variants.map((v) => ({
      id: v.id,
      tamanho: v.size,
      cor: v.color,
      estoque: v.stock,
    })),
  };
}

export async function list() {
  const { data } = await http.get<StockApiItem[]>("/stock");
  return data.map(toEstoqueItem);
}

export async function registerEntry(
  productId: number,
  quantidade: number,
  motivo?: string,
  variantId?: number,
) {
  const { data } = await http.post(`/stock/${productId}/entry`, {
    quantity: quantidade,
    reason: motivo,
    variantId,
  });
  return data;
}

export async function registerExit(
  productId: number,
  quantidade: number,
  motivo?: string,
  variantId?: number,
) {
  const { data } = await http.post(`/stock/${productId}/exit`, {
    quantity: quantidade,
    reason: motivo,
    variantId,
  });
  return data;
}

export async function listMovements() {
  const { data } = await http.get<MovimentacaoEstoque[]>("/stock/movements");
  return data;
}