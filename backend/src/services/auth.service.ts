import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/app-error';

export async function register(name: string, email: string, password: string) {
    const existingUser = await prisma.usuario.findUnique({ where: { email } });

    if (existingUser){
        throw new AppError('Email já cadastrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
        data: { nome: name, email, senha: passwordHash },
        select: { id: true, nome: true, email: true, role: true }
    });

    return user;
}

export async function login(email: string, password: string){
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user){
        throw new AppError('Credenciais inválidas!', 401);
    }

    if(!user.ativo){
        throw new AppError('Usuário desabilitado' , 403);
    }

    const comparePassoword = await bcrypt.compare(password , user.senha);

    if(!comparePassoword){
        throw new AppError('Credenciais inválidas!' , 401);
    }

    const token = jwt.sign({userId: user.id, role: user.role}, 
            process.env.JWT_SECRET!, {expiresIn: '15m'});

    return{token, user:{
        id: user.id,
        name: user.nome,
        email: user.email,
        role: user.role
    }};
}