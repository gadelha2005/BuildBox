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