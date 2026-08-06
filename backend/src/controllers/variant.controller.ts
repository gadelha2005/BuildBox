import {Request, Response, NextFunction} from 'express';
import * as variantService from '../services/variant.service';
import {z} from 'zod';

const addVariantSchema = z.object({
    size: z.string().min(1).optional(),
    color: z.string().min(1).optional(),
    stock: z.number().int().min(0),
});

export async function add(request: Request, response: Response, next: NextFunction){
    const productId = Number(request.params.id);
    const {size, color, stock} = addVariantSchema.parse(request.body);
    const variant = await variantService.add({productId, size, color, stock});

    return response.status(201).json(variant);
}



