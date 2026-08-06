import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/mais-vendidos', reportController.mostSold);
router.get('/estoque-critico', reportController.criticalStock);
router.get('/faturamento', reportController.revenue);

export default router;