import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from './errors/app-error';
import authRoutes from './routes/auth.route';
import { authMiddleware } from './middlewares/auth.middlware';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth' , authRoutes);

app.get('/health', (request: Request, response: Response) => {
  response.json({ status: 'ok' });
});

app.get('/me', authMiddleware, (request: Request, response: Response) => {
  response.json({ user: request.user });
});

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if(error instanceof ZodError){
        return response.status(400).json({
            message: 'Dados inválidos', 
            issues: error.issues
        });
    }

    if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError){
        return response.status(401).json({message: 'token inválido ou expirado'});
    }

    if(error instanceof AppError){
        return response.status(error.statusCode).json({message: error.message});
    }

    console.error(error);
    response.status(500).json({message: error.message});
});

export default app;