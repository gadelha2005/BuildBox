import {prisma} from '../lib/prisma';
import {AppError} from '../errors/app-error';

export async function checkout(userId: number, addressId: number) {
  const cartItems = await prisma.itemCarrinho.findMany({
    where: { usuarioId: userId },
    include: { produto: true, variacaoProduto: true },
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const address = await prisma.endereco.findUnique({ where: { id: addressId } });

  if (!address || address.usuarioId !== userId) {
    throw new AppError('Address not found', 404);
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.produto.preco) * item.quantidade;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of cartItems) {
      if (item.variacaoProdutoId) {
        const variant = await tx.variacaoProduto.findUnique({
          where: { id: item.variacaoProdutoId },
        });

        if (!variant || variant.estoque < item.quantidade) {
          throw new AppError(`Insufficient stock for product "${item.produto.nome}"`, 409);
        }

        await tx.variacaoProduto.update({
          where: { id: item.variacaoProdutoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      } else {
        const product = await tx.produto.findUnique({ where: { id: item.produtoId } });

        if (!product || product.estoque < item.quantidade) {
          throw new AppError(`Insufficient stock for product "${item.produto.nome}"`, 409);
        }

        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      }
    }

    const createdOrder = await tx.pedido.create({
      data: {
        usuarioId: userId,
        total,
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep,
        itens: {
          create: cartItems.map((item) => ({
            produtoId: item.produtoId,
            variacaoProdutoId: item.variacaoProdutoId,
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco,
          })),
        },
      },
      include: { itens: true },
    });

    await tx.itemCarrinho.deleteMany({ where: { usuarioId: userId } });

    return createdOrder;
  });

  return order;
}