import { http } from "./http";
import type { Pedido, StatusPedido } from "../types";

export interface CheckoutPayload {
  enderecoId?: number;
  rua: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export async function checkout(payload: CheckoutPayload) {
  const { data } = await http.post<Pedido>("/orders", payload);
  return data;
}

export async function findMine() {
  const { data } = await http.get<Pedido[]>("/orders/me");
  return data;
}

export async function findMineById(id: number) {
  const { data } = await http.get<Pedido>(`/orders/me/${id}`);
  return data;
}

export async function findAll(status?: StatusPedido) {
  const { data } = await http.get<Pedido[]>("/orders", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function findById(id: number) {
  const { data } = await http.get<Pedido>(`/orders/${id}`);
  return data;
}

export async function updateStatus(id: number, status: StatusPedido) {
  const { data } = await http.patch<Pedido>(`/orders/${id}/status`, { status });
  return data;
}

export async function cancel(id: number) {
  const { data } = await http.patch<Pedido>(`/orders/${id}/cancel`);
  return data;
}
