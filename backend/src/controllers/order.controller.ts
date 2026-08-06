import { Request, Response } from 'express';
import { z } from 'zod';
import * as orderService from '../services/order.service';

const checkoutSchema = z.object({
  addressId: z.number().int().positive(),
});

export async function checkout(request: Request, response: Response) {
  const userId = request.user!.userId;
  const { addressId } = checkoutSchema.parse(request.body);
  const order = await orderService.checkout(userId, addressId);

  return response.status(201).json(order);
}

export async function findMine(request: Request, response: Response) {
  const userId = request.user!.userId;
  const orders = await orderService.findMine(userId);

  return response.status(200).json(orders);
}

export async function findMineById(request: Request, response: Response) {
  const userId = request.user!.userId;
  const orderId = Number(request.params.id);
  const order = await orderService.findMineById(userId, orderId);

  return response.status(200).json(order);
}