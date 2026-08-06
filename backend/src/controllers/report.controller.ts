import { Request, Response , NextFunction } from 'express';
import { z } from 'zod';
import * as reportService from '../services/report.service';

const revenueQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export async function mostSold(request: Request, response: Response , next: NextFunction) {
  const data = await reportService.mostSold();

  return response.status(200).json(data);
}

export async function criticalStock(request: Request, response: Response , next: NextFunction) {
  const data = await reportService.criticalStock();

  return response.status(200).json(data);
}


export async function revenue(request: Request, response: Response , next: NextFunction) {
  const { startDate, endDate } = revenueQuerySchema.parse(request.query);
  const data = await reportService.revenue(startDate, endDate);

  return response.status(200).json(data);
}