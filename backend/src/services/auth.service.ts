import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';

export async function register(name: string, email: string, password: string) {
    const existingUser = await prisma.usuario.findUnique({ where: { email } });

    if (existingUser) {
        throw new AppError('Email já cadastrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
        data: { nome: name, email, senha: passwordHash },
        select: { id: true, nome: true, email: true, role: true }
    });

    return user;
}