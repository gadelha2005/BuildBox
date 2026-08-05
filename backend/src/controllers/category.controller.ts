import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import * as categoryService from '../services/category.service';

const categorySchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório')
});

export async function create(request: Request, response: Response, next: NextFunction){
    const {name} = categorySchema.parse(request.body);
    const category = await categoryService.create(name);

    return response.status(201).json(category);
}

export async function findAll(request: Request, response: Response, next: NextFunction){
    const categories = await categoryService.findAll();

    return response.status(200).json(categories);
}

export async function update(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id);
    const {name} = categorySchema.parse(request.body);
    const category = await categoryService.update(id, name);

    return response.status(200).json(category);
}

export async function remove(request: Request, response: Response, next: NextFunction){
    const id = Number(request.params.id);
    await categoryService.remove(id);

    return response.status(204).send();
}



