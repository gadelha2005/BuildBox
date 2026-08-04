import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import * as authService from '../services/auth.service';
import {AppError} from '../errors/app-error';

const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Formato inválido de email"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export async function register(request: Request, response: Response, next: NextFunction){
    const {name, email, password} = registerSchema.parse(request.body);
    const user = await authService.register(name, email, password);

    return response.status(201).json(user);
}



