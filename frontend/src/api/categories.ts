import { http } from "./http";
import type { Categoria } from "../types";

export async function findAll() {
  const { data } = await http.get<Categoria[]>("/categories");
  return data;
}

export async function create(nome: string) {
  const { data } = await http.post<Categoria>("/categories", { nome });
  return data;
}

export async function update(id: number, nome: string) {
  const { data } = await http.put<Categoria>(`/categories/${id}`, { nome });
  return data;
}

export async function remove(id: number) {
  await http.delete(`/categories/${id}`);
}
