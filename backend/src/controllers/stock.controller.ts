import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as stockService from '../services/stock.service';

const stockMovementSchema = z.object({
  variantId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),
  reason: z.string().min(1).optional(),
});

export async function list(request: Request, response: Response, next: NextFunction){
    const stock = await stockService.listStock();

    return response.status(200).json(stock);
}

export async function registerEntry(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const productId = Number(request.params.productId);
    const data = stockMovementSchema.parse(request.body);
    const movement = await stockService.registerEntry({productId, userId, ...data});

    return response.status(201).json(movement);
}

export async function registerExit(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const productId = Number(request.params.productId);
    const data = stockMovementSchema.parse(request.body);
    const movement = await stockService.registerExit({productId, userId, ...data});

    return response.status(201).json(movement);
}

export async function listMovements(request: Request, response: Response , next: NextFunction) {
  const movements = await stockService.listMovements();

  return response.status(200).json(movements);
}