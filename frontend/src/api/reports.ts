import { http } from "./http";

export interface ProdutoMaisVendido {
  produtoId: number;
  nome: string;
  quantidadeVendida: number;
}

export interface ProdutoEstoqueCritico {
  produtoId: number;
  nome: string;
  estoque: number;
  estoqueMinimo: number;
}

export interface Faturamento {
  periodo: string;
  total: number;
}

export async function mostSold() {
  const { data } = await http.get<ProdutoMaisVendido[]>(
    "/reports/mais-vendidos",
  );
  return data;
}

export async function criticalStock() {
  const { data } = await http.get<ProdutoEstoqueCritico[]>(
    "/reports/estoque-critico",
  );
  return data;
}

export async function revenue(from?: string, to?: string) {
  const { data } = await http.get<Faturamento>("/reports/faturamento", {
    params: { from, to },
  });
  return data;
}
