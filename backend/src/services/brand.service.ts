import { AppError } from "../errors/app-error";
import { prisma } from "../lib/prisma";
import { Brand } from "../types/brand";

export async function create(name: string): Promise<Brand> {
    const existingBrand = await prisma.marca.findUnique({ where: { nome: name } });

    if (existingBrand) {
        throw new AppError('Marca já existente', 409);
    }

    return prisma.marca.create({ data: { nome: name } });
}

export async function findAll(): Promise<Brand[]> {
    return prisma.marca.findMany();
}

export async function update(id: number, name: string): Promise<Brand> {
    const brand = await prisma.marca.findUnique({ where: { id } });

    if (!brand) {
        throw new AppError('Marca não encontrada', 404);
    }

    return prisma.marca.update({ where: { id }, data: { nome: name } });
}

export async function remove(id: number): Promise<Brand> {
    const brand = await prisma.marca.findUnique({ where: { id } });

    if (!brand) {
        throw new AppError('Marca não encontrada', 404);
    }

    return prisma.marca.delete({ where: { id } });
}