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