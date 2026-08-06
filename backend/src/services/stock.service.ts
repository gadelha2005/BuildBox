import { prisma } from "../lib/prisma";
import { AppError } from "../errors/app-error";
import { StockMovementInput, StockItem } from "../types/stock";

export async function listStock(): Promise<StockItem[]> {
  const products = await prisma.produto.findMany({
    where: { ativo: true },
    include: { variacoes: true },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.nome,
    stock: product.estoque,
    minStock: product.estoqueMinimo,
    lowStock: product.estoque <= product.estoqueMinimo,
    variants: product.variacoes.map((variant) => ({
      id: variant.id,
      size: variant.tamanho,
      color: variant.cor,
      stock: variant.estoque,
    })),
  }));
}

export async function registerEntry(data: StockMovementInput) {
  return registerMovement('ENTRADA', data);
}

export async function registerExit(data: StockMovementInput) {
  return registerMovement('SAIDA', data);
}

async function registerMovement(type: 'ENTRADA' | 'SAIDA', data: StockMovementInput) {
  return prisma.$transaction(async (tx) => {
    if (data.variantId) {
      const variant = await tx.variacaoProduto.findUnique({ where: { id: data.variantId } });

      if (!variant || variant.produtoId !== data.productId) {
        throw new AppError('Variação não encontrada', 404);
      }

      if (type === 'SAIDA' && variant.estoque < data.quantity) {
        throw new AppError('Estoque insuficiente', 409);
      }

      await tx.variacaoProduto.update({
        where: { id: data.variantId },
        data: {
          estoque: type === 'ENTRADA' ? { increment: data.quantity } : { decrement: data.quantity },
        },
      });
    } 
    else {
      const product = await tx.produto.findUnique({ where: { id: data.productId } });

      if (!product) {
        throw new AppError('Produto não encontrado', 404);
      }

      if (type === 'SAIDA' && product.estoque < data.quantity) {
        throw new AppError('Estoque insuficiente', 409);
      }

      await tx.produto.update({
        where: { id: data.productId },
        data: {
          estoque: type === 'ENTRADA' ? { increment: data.quantity } : { decrement: data.quantity },
        },
      });
    }

    return tx.movimentacaoEstoque.create({
      data: {
        produtoId: data.productId,
        variacaoProdutoId: data.variantId,
        usuarioId: data.userId,
        tipo: type,
        quantidade: data.quantity,
        motivo: data.reason,
      },
    });
  });
}

export async function listMovements() {
  return prisma.movimentacaoEstoque.findMany({
    include: {
      produto: true,
      variacaoProduto: true,
      usuario: { select: { id: true, nome: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}