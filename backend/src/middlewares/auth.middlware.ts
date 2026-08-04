import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AppError} from '../errors/app-error';

interface TokenPayload{
    userId: number;
    role: string;
}

export function authMiddleware(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('Token não fornecido' , 401);
    }

    const [, token] = authHeader.split(' ');

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    request.user = payload;

    next();
}

