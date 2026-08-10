import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { CartItem, AddToCartInput } from '../types/cart';

function toCartItem(item: {
  id: number;
  usuarioId: number;
  produtoId: number;
  variacaoProdutoId: number | null;
  quantidade: number;
  createdAt: Date;
}): CartItem {
  return {
    id: item.id,
    userId: item.usuarioId,
    productId: item.produtoId,
    variantProductId: item.variacaoProdutoId,
    quantity: item.quantidade,
    createdAt: item.createdAt,
  };
}

export async function add(data: AddToCartInput): Promise<CartItem> {
  const product = await prisma.produto.findUnique({
    where: { id: data.productId },
    include: { variacoes: true },
  });

  if (!product || !product.ativo) {
    throw new AppError('Product nao encontrado', 404);
  }

  if (product.variacoes.length > 0 && !data.variantId) {
    throw new AppError('Esse produto requer a seleção de uma variante', 400);
  }

  let availableStock: number;

  if (data.variantId) {
    const variant = product.variacoes.find((variant) => variant.id === data.variantId);

    if (!variant) {
      throw new AppError('Variante não encontrada', 404);
    }

    availableStock = variant.estoque;
  } else {
    availableStock = product.estoque;
  }

  if (availableStock === 0) {
    throw new AppError('Produto esgotado', 409);
  }

  const existingItem = await prisma.itemCarrinho.findFirst({
        where: {
            usuarioId: data.userId,
            produtoId: data.productId,
            variacaoProdutoId: data.variantId ?? null,
        },
    });

  const newQuantity = (existingItem?.quantidade ?? 0) + data.quantity;

  if (newQuantity > availableStock) {
    throw new AppError('Quantidade excede o valor do estoque', 409);
  }

  const item = existingItem
    ? await prisma.itemCarrinho.update({
        where: { id: existingItem.id },
        data: { quantidade: newQuantity },
      })
    : await prisma.itemCarrinho.create({
        data: {
          usuarioId: data.userId,
          produtoId: data.productId,
          variacaoProdutoId: data.variantId,
          quantidade: data.quantity,
        },
      });

  return toCartItem(item);
}

export async function findByUser(userId: number) {
  const items = await prisma.itemCarrinho.findMany({
    where: { usuarioId: userId },
    include: {
      produto: { include: { fotos: { orderBy: { ordem: 'asc' } } } },
      variacaoProduto: true,
    },
  });

  const total = items.reduce((sum, item) => {
    return sum + Number(item.produto.preco) * item.quantidade;
  }, 0);

  return {
    items: items.map((item) => ({
      ...toCartItem(item),
      product: item.produto,
      variant: item.variacaoProduto,
    })),
    total,
  };
}

export async function updateQuantity(
  userId: number,
  itemId: number,
  quantity: number
): Promise<CartItem> {
  const item = await prisma.itemCarrinho.findUnique({
    where: { id: itemId },
    include: { produto: true, variacaoProduto: true },
  });

  if (!item || item.usuarioId !== userId) {
    throw new AppError('Item do carrinho não encontrado', 404);
  }

  const availableStock = item.variacaoProduto
    ? item.variacaoProduto.estoque
    : item.produto.estoque;

  if (quantity > availableStock) {
    throw new AppError('Quantidade excede o valor do estoque' , 409);
  }

  const updated = await prisma.itemCarrinho.update({
    where: { id: itemId },
    data: { quantidade: quantity },
  });

  return toCartItem(updated);
}

export async function remove(userId: number, itemId: number): Promise<void> {
  const item = await prisma.itemCarrinho.findUnique({ where: { id: itemId } });

  if (!item || item.usuarioId !== userId) {
    throw new AppError('Item do carrinho não encontrado', 404);
  }

  await prisma.itemCarrinho.delete({ where: { id: itemId } });
}