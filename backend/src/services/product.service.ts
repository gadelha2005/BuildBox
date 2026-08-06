import {prisma} from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { Product, CreateProductInput , UpdateProductInput , FindAllFilters } from '../types/product';
import { Prisma } from '@prisma/client';
import { ProductWithPhotos } from '../types/product';

export async function create(data: CreateProductInput): Promise<Product>{
    const category = await prisma.categoria.findUnique({where: {id: data.categoryId}});

    if(!category){
        throw new AppError('Categoria não encontrada' , 404);
    }

    const brand = await prisma.marca.findUnique({where: {id: data.brandId}});

    if(!brand){
        throw new AppError('Marca não encontrada' , 404);
    }

    return prisma.produto.create({
        data: {
            nome: data.name,
            descricao: data.description,
            preco: data.price,
            unidadeMedida: data.unit,
            categoriaId: data.categoryId,
            marcaId: data.brandId,
            estoque: data.stock ?? 0,
            estoqueMinimo: data.minStock ?? 0,
        }
    })
}

export async function findAll(filters: FindAllFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  const where: Prisma.ProdutoWhereInput = {
    ativo: true,
    ...(filters.search && { nome: { contains: filters.search } }),
    ...(filters.categoryId && { categoriaId: filters.categoryId }),
    ...(filters.brandId && { marcaId: filters.brandId }),
    ...((filters.minPrice || filters.maxPrice) && {
      preco: {
        ...(filters.minPrice && { gte: filters.minPrice }),
        ...(filters.maxPrice && { lte: filters.maxPrice }),
      },
    }),
  };

  const orderBy: Prisma.ProdutoOrderByWithRelationInput =
    filters.sort === 'price_asc'
      ? { preco: 'asc' }
      : filters.sort === 'price_desc'
      ? { preco: 'desc' }
      : {};

  const [products, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.produto.count({ where }),
  ]);

  return { products, total, page, limit };
}

export async function findById(id: number): Promise<ProductWithPhotos> {
  const product = await prisma.produto.findUnique({
    where: { id },
    include: {
      fotos: { orderBy: { ordem: 'asc' } },
      variacoes: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
}

export async function update(id: number, data: UpdateProductInput): Promise<Product>{
    const product = await prisma.produto.findUnique({where: {id}});

    if(!product){
        throw new AppError('Produto não encontrado' , 404);
    }

    return prisma.produto.update({
        where: { id },
        data: {
        nome: data.name,
        descricao: data.description,
        preco: data.price,
        unidadeMedida: data.unit,
        categoriaId: data.categoryId,
        marcaId: data.brandId,
        estoque: data.stock,
        estoqueMinimo: data.minStock,
        },
    });
}

export async function deactivate(id: number): Promise<Product>{
    const product = await prisma.produto.findUnique({where: {id}});

    if(!product){
        throw new AppError('Produto não encontrado' , 404);
    }

    return prisma.produto.update({where: {id}, data: {ativo: false}});
}

export async function remove(id: number): Promise<Product>{
    const product = await prisma.produto.findUnique({where: {id}});

    if(!product){
        throw new AppError('Produto não encontrado' , 404);
    }

    return prisma.produto.delete({where: {id}});
}