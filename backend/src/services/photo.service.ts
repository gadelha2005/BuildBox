import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { AddPhotoInput, ProductPhoto } from '../types/product';

export async function add(data: AddPhotoInput): Promise<ProductPhoto> {
  const product = await prisma.produto.findUnique({ where: { id: data.productId } });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return prisma.fotoProduto.create({
    data: {
      produtoId: data.productId,
      url: data.url,
      ordem: data.order ?? 0,
    },
  });
}

export async function remove(productId: number, photoId: number): Promise<void> {
  const photo = await prisma.fotoProduto.findUnique({ where: { id: photoId } });

  if (!photo || photo.produtoId !== productId) {
    throw new AppError('Photo not found', 404);
  }

  await prisma.fotoProduto.delete({ where: { id: photoId } });
}