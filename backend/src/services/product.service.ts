import {prisma} from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { Product, CreateProductInput , UpdateProductInput } from '../types/product';

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

export async function findAll(): Promise<Product[]>{
    return prisma.produto.findMany({where: {ativo: true}});
}

export async function findById(id: number): Promise<Product>{
    const product = await prisma.produto.findUnique({where: {id}});

    if(!product){
        throw new AppError('Produto não encontrado' , 404);
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