import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import * as cartService from '../services/cart.service';

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});

export async function add(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const data = addToCartSchema.parse(request.body);
    const item = await cartService.add({userId, ...data});

    return response.status(201).json(item);
}

export async function findMine(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const cart = await cartService.findByUser(userId);

    return response.status(200).json(cart);
}

export async function updateQuantity(request: Request, response: Response) {
  const userId = request.user!.userId;
  const itemId = Number(request.params.id);
  const { quantity } = updateQuantitySchema.parse(request.body);
  const item = await cartService.updateQuantity(userId, itemId, quantity);

  return response.status(200).json(item);
}

export async function remove(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const itemId = Number(request.params.id);
    await cartService.remove(userId, itemId);

    return response.status(204).send();
}