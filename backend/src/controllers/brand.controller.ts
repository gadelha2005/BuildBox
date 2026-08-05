import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import * as brandService from '../services/brand.service';

const brandSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório')
});

export async function create(request: Request, response: Response, next: NextFunction){
    const {name} = brandSchema.parse(request.body);
    const brand = await brandService.create(name);

    return response.status(201).json(brand);
}

export async function findAll(request: Request, response: Response, next: NextFunction){
    const brands = await brandService.findAll();

    return response.status(200).json(brands);
}

export async function update(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id);
    const {name} = brandSchema.parse(request.body);
    const brand = await brandService.update(id, name);

    return response.status(200).json(brand);
}

export async function remove(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id);
    await brandService.remove(id);

    return response.status(204).send();
}


