import { http } from "./http";
import { toEstoqueItem } from "./stock";
import type { StockApiItem } from "./stock";

export interface ProdutoMaisVendido {
  produtoId: number;
  nome: string;
  quantidadeVendida: number;
}

export interface Faturamento {
  total: number;
  totalPedidos: number;
}

interface MostSoldApiItem {
  productId: number;
  name: string;
  quantitySold: number;
}

interface RevenueApiResponse {
  total: number;
  orderCount: number;
}

export async function mostSold() {
  const { data } = await http.get<MostSoldApiItem[]>("/reports/mais-vendidos");
  return data.map((item) => ({
    produtoId: item.productId,
    nome: item.name,
    quantidadeVendida: item.quantitySold,
  }));
}

export async function criticalStock() {
  const { data } = await http.get<StockApiItem[]>("/reports/estoque-critico");
  return data.map(toEstoqueItem);
}

export async function revenue(startDate?: string, endDate?: string) {
  const { data } = await http.get<RevenueApiResponse>("/reports/faturamento", {
    params: { startDate, endDate },
  });
  return { total: data.total, totalPedidos: data.orderCount };
}