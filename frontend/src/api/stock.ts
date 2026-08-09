import { http } from "./http";
import type { MovimentacaoEstoque, Produto } from "../types";

export async function list() {
  const { data } = await http.get<Produto[]>("/stock");
  return data;
}

export async function registerEntry(
  productId: number,
  quantidade: number,
  motivo?: string,
) {
  const { data } = await http.post(`/stock/${productId}/entry`, {
    quantidade,
    motivo,
  });
  return data;
}

export async function registerExit(
  productId: number,
  quantidade: number,
  motivo?: string,
) {
  const { data } = await http.post(`/stock/${productId}/exit`, {
    quantidade,
    motivo,
  });
  return data;
}

export async function listMovements() {
  const { data } = await http.get<MovimentacaoEstoque[]>("/stock/movements");
  return data;
}
