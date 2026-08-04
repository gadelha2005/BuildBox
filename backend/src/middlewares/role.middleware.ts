import {Request, Response, NextFunction} from 'express';
import {AppError} from '../errors/app-error';

export function requireRole(...roles: string[]){
    return (request: Request, response: Response, next: NextFunction) => {
        if(!request.user){
            throw new AppError('Não autenticado' , 401);
        }

        if(!roles.includes(request.user.role)){
            throw new AppError('Acesso negado' , 403);
        }

        next();
    }
}