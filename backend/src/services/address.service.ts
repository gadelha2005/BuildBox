import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { Address, CreateAddressInput, UpdateAddressInput } from '../types/address';

function toAddress(item: {
  id: number;
  usuarioId: number;
  rua: string;
  numero: string;
  complemento: string | null;
  cidade: string;
  estado: string;
  cep: string;
  createdAt: Date;
  updatedAt: Date;
}): Address {
  return {
    id: item.id,
    userId: item.usuarioId,
    street: item.rua,
    number: item.numero,
    complement: item.complemento,
    city: item.cidade,
    state: item.estado,
    zipCode: item.cep,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function create(data: CreateAddressInput): Promise<Address>{
    const addres = await prisma.endereco.create({
      data: {
        usuarioId: data.userId,
        rua: data.street,
        numero: data.number,
        complemento: data.complement,
        cidade: data.city,
        estado: data.state,
        cep: data.zipCode,
      }
    });

    return toAddress(addres);
}

export async function findByUser(userId: number): Promise<Address[]> {
  const addresses = await prisma.endereco.findMany({ where: { usuarioId: userId } });
  return addresses.map(toAddress);
}

export async function update(
  userId: number,
  id: number,
  data: UpdateAddressInput
): Promise<Address> {
  const address = await prisma.endereco.findUnique({ where: { id } });

  if (!address || address.usuarioId !== userId) {
    throw new AppError('Address not found', 404);
  }

  const updated = await prisma.endereco.update({
    where: {id},
    data: {
      rua: data.street,
      numero: data.number,
      complemento: data.complement,
      cidade: data.city,
      estado: data.state,
      cep: data.zipCode,
    },
  });

  return toAddress(updated);
}
export async function remove(userId: number, id: number): Promise<void> {
  const address = await prisma.endereco.findUnique({ where:{id}});

  if (!address || address.usuarioId !== userId) {
    throw new AppError('Endereço não encontrado', 404);
  }

  await prisma.endereco.delete({ where: { id } });
}