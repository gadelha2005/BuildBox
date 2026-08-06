import {Prisma} from '@prisma/client';

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: Prisma.Decimal;
  unidadeMedida: string;
  categoriaId: number;
  marcaId: number;
  estoque: number;
  estoqueMinimo: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  unit: string;
  categoryId: number;
  brandId: number;
  stock?: number;
  minStock?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  categoryId?: number;
  brandId?: number;
  stock?: number;
  minStock?: number;
}

export interface FindAllFilters {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface ProductPhoto {
  id: number;
  url: string;
  ordem: number;
  produtoId: number;
}

export interface AddPhotoInput {
  productId: number;
  url: string;
  order?: number;
}
export interface ProductWithPhotos extends Product {
  fotos: ProductPhoto[];
  variacoes: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  tamanho: string | null;
  cor: string | null;
  estoque: number;
  produtoId: number;
}

export interface AddVariantInput{
    productId: number;
    size?: string;
    color?: string;
    stock: number;
}