import { Request, Response, NextFunction} from 'express';
import { z } from 'zod';
import * as orderService from '../services/order.service';

const checkoutSchema = z.object({
  addressId: z.number().int().positive(),
});

const findAllQuerySchema = z.object({
  status: z.enum(['EM_SEPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['ENVIADO', 'ENTREGUE']),
});

export async function checkout(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const { addressId } = checkoutSchema.parse(request.body);
  const order = await orderService.checkout(userId, addressId);

  return response.status(201).json(order);
}

export async function findMine(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const orders = await orderService.findMine(userId);

  return response.status(200).json(orders);
}

export async function findMineById(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const orderId = Number(request.params.id);
  const order = await orderService.findMineById(userId, orderId);

  return response.status(200).json(order);
}

export async function findAll(request: Request, response: Response, next: NextFunction){
  const {status} = findAllQuerySchema.parse(request.query);
  const orders = await orderService.findAll(status);

  return response.status(200).json(orders);
}

export async function findById(request: Request, response: Response) {
  const orderId = Number(request.params.id);
  const order = await orderService.findById(orderId);

  return response.status(200).json(order);
}

export async function updateStatus(request: Request, response: Response, next: NextFunction){
  const orderId = Number(request.params.id);
  const {status} = updateStatusSchema.parse(request.body);
  const order = await orderService.updateStatus(orderId, status);

  return response.status(200).json(order);
}

export async function cancel(request: Request, response: Response) {
  const orderId = Number(request.params.id);
  const order = await orderService.cancel(orderId);

  return response.status(200).json(order);
}
