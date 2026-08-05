import {prisma} from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { Category } from '../types/category';

export async function create(name: string): Promise<Category>{
    const existing = await prisma.categoria.findUnique({where: {nome: name}});

    if(existing){
        throw new AppError('Categoria já existe' , 409);
    }

    return prisma.categoria.create({data: {nome: name}});
}

export async function findAll(): Promise<Category[]>{
    return prisma.categoria.findMany();
}

export async function update(id: number, name: string): Promise<Category>{
    const category = await prisma.categoria.findUnique({where: {id}});

    if(!category){
        throw new AppError('Categoria não encontrada' , 404);
    }

    return prisma.categoria.update({where: {id}, data: {nome: name}});
}

export async function remove(id: number): Promise<Category>{
    const category = await prisma.categoria.findUnique({where: {id}});

    if(!category){
        throw new AppError('Categoria não encontrada' , 404);
    }

     return prisma.categoria.delete({ where: { id } });
}
