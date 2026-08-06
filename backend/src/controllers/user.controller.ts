import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as userService from '../services/user.service';

const updateRoleSchema = z.object({
  role: z.enum(['CLIENTE', 'FUNCIONARIO', 'ADMIN']),
});

const updateStatusSchema = z.object({
  active: z.boolean(),
});

export async function findAll(request: Request, response: Response, next: NextFunction){
    const users = await userService.findAll();
    
    return response.status(200).json(users);
}

export async function updateRole(request: Request, response: Response, next: NextFunction) {
  const id = Number(request.params.id);
  const { role } = updateRoleSchema.parse(request.body);
  const user = await userService.updateRole(id, role);

  return response.status(200).json(user);
}

export async function updateStatus(request: Request, response: Response, next: NextFunction) {
  const id = Number(request.params.id);
  const { active } = updateStatusSchema.parse(request.body);
  const user = await userService.updateStatus(id, active);

  return response.status(200).json(user);
}

