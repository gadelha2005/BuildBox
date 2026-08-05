import { Request, Response } from 'express';
import { z } from 'zod';
import * as photoService from '../services/photo.service';

const addPhotoSchema = z.object({
  url: z.string().url('Invalid URL'),
  order: z.number().int().min(0).optional(),
});

export async function add(request: Request, response: Response) {
  const productId = Number(request.params.id);
  const { url, order } = addPhotoSchema.parse(request.body);
  const photo = await photoService.add({ productId, url, order });

  return response.status(201).json(photo);
}

export async function remove(request: Request, response: Response) {
  const productId = Number(request.params.id);
  const photoId = Number(request.params.photoId);
  await photoService.remove(productId, photoId);
  
  return response.status(204).send();
}