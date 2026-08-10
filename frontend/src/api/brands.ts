import { http } from "./http";
import type { Marca } from "../types";

export async function findAll() {
  const { data } = await http.get<Marca[]>("/brands");
  return data;
}

export async function create(nome: string) {
  const { data } = await http.post<Marca>("/brands", { nome });
  return data;
}

export async function update(id: number, nome: string) {
  const { data } = await http.put<Marca>(`/brands/${id}`, { nome });
  return data;
}

export async function remove(id: number) {
  await http.delete(`/brands/${id}`);
}
