import { Request, Response, NextFunction, response } from "express";
import { AppError } from "../errors/app-error";

export function errorHandler(error: Error, request: Request, ressponse: Response, next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return response.status(500).json({ error: "Erro interno do servidor" });
}