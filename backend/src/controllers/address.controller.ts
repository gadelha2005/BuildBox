import { Request, Response, NextFunction} from 'express';
import { z } from 'zod';
import * as addressService from '../services/address.service';

const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

const updateAddressSchema = addressSchema.partial();

export async function create(request: Request, response: Response, next: NextFunction){
    const userId = request.user!.userId;
    const data = addressSchema.parse(request.body);
    const address = await addressService.create({userId, ...data});

    return response.status(201).json(address);
}

export async function findMine(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const addresses = await addressService.findByUser(userId);

  return response.status(200).json(addresses);
}

export async function update(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const id = Number(request.params.id);
  const data = updateAddressSchema.parse(request.body);
  const address = await addressService.update(userId, id, data);

  return response.status(200).json(address);
}

export async function remove(request: Request, response: Response, next: NextFunction) {
  const userId = request.user!.userId;
  const id = Number(request.params.id);
  await addressService.remove(userId, id);

  return response.status(204).send();
}