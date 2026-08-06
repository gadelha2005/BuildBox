import { prisma } from '../lib/prisma';
import { listStock } from './stock.service';

export async function mostSold(limit = 10) {
  const grouped = await prisma.itemPedido.groupBy({
    by: ['produtoId'],
    _sum: { quantidade: true },
    orderBy: { _sum: { quantidade: 'desc' } },
    take: limit,
  });

  const productIds = grouped.map((g) => g.produtoId);
  const products = await prisma.produto.findMany({ where: { id: { in: productIds } } });

  return grouped.map((g) => {
    const product = products.find((p) => p.id === g.produtoId);
    return {
      productId: g.produtoId,
      name: product?.nome ?? '',
      quantitySold: g._sum.quantidade ?? 0,
    };
  });
}

export async function criticalStock() {
  const stock = await listStock();
  return stock.filter((item) => item.lowStock);
}

export async function revenue(startDate?: Date, endDate?: Date) {
  const result = await prisma.pedido.aggregate({
    where: {
      status: 'ENTREGUE',
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    },
    _sum: { total: true },
    _count: true,
  });

  return {
    total: Number(result._sum.total ?? 0),
    orderCount: result._count,
  };
}