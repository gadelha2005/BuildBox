import { http } from "./http";
import type { Produto, ProdutoListResponse, ProductFilters } from "../types";

interface ProductsApiResponse {
  products: Produto[];
  total: number;
  page: number;
  limit: number;
}

const sortMap = {
  preco_asc: "price_asc",
  preco_desc: "price_desc",
} as const;

export async function findAll(
  filters: ProductFilters = {},
): Promise<ProdutoListResponse> {
  const { data } = await http.get<ProductsApiResponse>("/products", {
    params: {
      search: filters.q,
      categoryId: filters.categoriaId,
      brandId: filters.marcaId,
      minPrice: filters.precoMin,
      maxPrice: filters.precoMax,
      sort: filters.sort ? sortMap[filters.sort] : undefined,
      page: filters.page,
      limit: filters.pageSize,
    },
  });
  return { data: data.products, total: data.total };
}

export async function findById(id: number) {
  const { data } = await http.get<Produto>(`/products/${id}`);
  return data;
}

interface ProductFormPayload {
  nome: string;
  descricao: string;
  preco: number;
  unidadeMedida: string;
  categoriaId: number;
  marcaId: number;
  estoque?: number;
  estoqueMinimo?: number;
}

function toProductPayload(payload: Partial<ProductFormPayload>) {
  return {
    name: payload.nome,
    description: payload.descricao,
    price: payload.preco,
    unit: payload.unidadeMedida,
    categoryId: payload.categoriaId,
    brandId: payload.marcaId,
    stock: payload.estoque,
    minStock: payload.estoqueMinimo,
  };
}

export async function create(payload: ProductFormPayload) {
  const { data } = await http.post<Produto>("/products", toProductPayload(payload));
  return data;
}

export async function update(id: number, payload: Partial<ProductFormPayload>) {
  const { data } = await http.put<Produto>(`/products/${id}`, toProductPayload(payload));
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
  const { data } = await http.post(`/products/${id}/photos`, { url, order: ordem });
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
    size: tamanho,
    color: cor,
    stock: estoque,
  });
  return data;
}