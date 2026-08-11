import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import * as productService from '../services/product.service';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().positive('Preço deve ser positivo'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
});

const findAllQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

const updateProductSchema = createProductSchema.partial();

export async function create(request: Request, response: Response, next: NextFunction){
    const data = createProductSchema.parse(request.body);
    const product = await productService.create(data);

    return response.status(201).json(product);
}

export async function findAll(request: Request, response: Response) {
  const filters = findAllQuerySchema.parse(request.query);
  const result = await productService.findAll(filters);
  
  return response.status(200).json(result);
}

export async function findById(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id)
    const product = await productService.findById(id);

    return response.status(200).json(product);
}

export async function update(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id)
    const data = updateProductSchema.parse(request.body);
    const product = await productService.update(id, data);

    return response.status(200).json(product);
}

export async function deactivate(request: Request, response: Response , next: NextFunction) {
  const id = Number(request.params.id);
  const product = await productService.deactivate(id);

  return response.status(200).json(product);
}

export async function activate(request: Request, response: Response , next: NextFunction) {
  const id = Number(request.params.id);
  const product = await productService.activate(id);

  return response.status(200).json(product);
}

export async function findAllAdmin(request: Request, response: Response , next: NextFunction) {
  const filters = findAllQuerySchema.parse(request.query);
  const result = await productService.findAll({ ...filters, includeInactive: true });

  return response.status(200).json(result);
}

export async function remove(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id)
    await productService.remove(id);
    
    return response.status(200).send();
}