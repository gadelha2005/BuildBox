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

export async function findMine(userId: number){
  return prisma.pedido.findMany({
    where: {usuarioId: userId},
    include: {itens: {include: {produto: true, variacaoProduto:true}}},
    orderBy: {createdAt: 'desc'}
  });
}

export async function findMineById(userId: number, orderId: number) {
  const order = await prisma.pedido.findUnique({
    where: { id: orderId },
    include: { itens: {include:{produto: true, variacaoProduto: true}}},
  });

  if (!order || order.usuarioId !== userId) {
    throw new AppError('Pedido não encontrado', 404);
  }

  return order;
}

export async function findAll(status?: string) {
  return prisma.pedido.findMany({
    where: status ? { status: status as any } : undefined,
    include: { itens: { include: { produto: true, variacaoProduto: true } }, usuario: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(orderId: number) {
  const order = await prisma.pedido.findUnique({
    where: { id: orderId },
    include: { itens: { include: { produto: true, variacaoProduto: true } }, usuario: true },
  });

  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }

  return order;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  EM_SEPARACAO: ['ENVIADO'],
  ENVIADO: ['ENTREGUE'],
  ENTREGUE: [],
  CANCELADO: [],
};

export async function updateStatus(orderId: number, newStatus: 'ENVIADO' | 'ENTREGUE') {
  const order = await prisma.pedido.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }

  const allowedNext = STATUS_TRANSITIONS[order.status] ?? [];

  if (!allowedNext.includes(newStatus)) {
    throw new AppError(`Não é possível alterar o status de ${order.status} para ${newStatus}`, 400);
  }

  return prisma.pedido.update({ where: { id: orderId }, data: { status: newStatus } });
}

export async function cancel(orderId: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.pedido.findUnique({
      where: { id: orderId },
      include: { itens: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== 'EM_SEPARACAO') {
      throw new AppError('Somente pedidos em separação podem ser cancelados', 400);
    }

    for (const item of order.itens) {
      if (item.variacaoProdutoId) {
        await tx.variacaoProduto.update({
          where: { id: item.variacaoProdutoId },
          data: { estoque: { increment: item.quantidade } },
        });
      } else {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { increment: item.quantidade } },
        });
      }
    }

    return tx.pedido.update({ where: { id: orderId }, data: { status: 'CANCELADO' } });
  });
}