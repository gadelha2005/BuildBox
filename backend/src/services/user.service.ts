import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { User } from '../types/user';

const userSelect = {
  id: true,
  nome: true,
  email: true,
  role: true,
  ativo: true,
  createdAt: true,
};

export async function findAll(): Promise<User[]>{
    return prisma.usuario.findMany({select: userSelect});
}

export async function updateRole(id: number, role: 'CLIENTE' | 'FUNCIONARIO' | 'ADMIN'): Promise<User>{
    const user = await prisma.usuario.findUnique({where: {id}});

    if(!user){
        throw new AppError('Usuário não encontrado' , 404);
    }

    return prisma.usuario.update({
        where: {id},
        data: {role},
        select: userSelect
    });
}

export async function updateStatus(id: number, active: boolean): Promise<User> {
  const user = await prisma.usuario.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return prisma.usuario.update({
    where: { id },
    data: { ativo: active },
    select: userSelect,
  });
}

