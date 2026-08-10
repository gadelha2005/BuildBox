import { http } from "./http";
import type { Produto, ProdutoListResponse, ProductFilters } from "../types";

export async function findAll(filters: ProductFilters = {}) {
  const { data } = await http.get<ProdutoListResponse>("/products", {
    params: filters,
  });
  return data;
}

export async function findById(id: number) {
  const { data } = await http.get<Produto>(`/products/${id}`);
  return data;
}

export async function create(payload: Partial<Produto>) {
  const { data } = await http.post<Produto>("/products", payload);
  return data;
}

export async function update(id: number, payload: Partial<Produto>) {
  const { data } = await http.put<Produto>(`/products/${id}`, payload);
  return data;
}

export async function deactivate(id: number) {
  const { data } = await http.patch(`/products/${id}/deactivate`);
  return data;
}

export async function remove(id: number) {
  await http.delete(`/products/${id}`);
}

export async function addPhoto(id: number, url: string, ordem = 0) {
  const { data } = await http.post(`/products/${id}/photos`, { url, ordem });
  return data;
}

export async function removePhoto(id: number, photoId: number) {
  await http.delete(`/products/${id}/photos/${photoId}`);
}

export async function addVariant(
  id: number,
  tamanho?: string,
  cor?: string,
  estoque = 0,
) {
  const { data } = await http.post(`/products/${id}/variants`, {
    tamanho,
    cor,
    estoque,
  });
  return data;
}
