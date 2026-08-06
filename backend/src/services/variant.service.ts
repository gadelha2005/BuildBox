import {prisma} from '../lib/prisma';
import { AppError } from '../errors/app-error';
import { ProductVariant } from '../types/product';

interface AddVariantInput{
    productId: number;
    size?: string;
    color?: string;
    stock: number;
}

export async function add(data: AddVariantInput): Promise<ProductVariant>{
    const product = await prisma.produto.findUnique({where: {id: data.productId}});

    if(!product){
        throw new AppError('Product não encontrado' , 409);
    }

    return prisma.variacaoProduto.create({
        data: {
            produtoId: data.productId,
            tamanho: data.size,
            cor: data.color,
            estoque: data.stock
        }
    });
}
