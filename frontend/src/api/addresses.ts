import { http } from "./http";
import type { Endereco } from "../types";

export async function findMine() {
  const { data } = await http.get<Endereco[]>("/addresses");
  return data;
}

export async function create(payload: Omit<Endereco, "id">) {
  const { data } = await http.post<Endereco>("/addresses", payload);
  return data;
}

export async function update(id: number, payload: Omit<Endereco, "id">) {
  const { data } = await http.put<Endereco>(`/addresses/${id}`, payload);
  return data;
}

export async function remove(id: number) {
  await http.delete(`/addresses/${id}`);
}
