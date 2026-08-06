import { Router } from 'express';
import * as stockController from '../controllers/stock.controller';
import { authMiddleware } from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, requireRole('FUNCIONARIO', 'ADMIN'));

router.get('/', stockController.list);
router.post('/:productId/entry', stockController.registerEntry);
router.post('/:productId/exit', stockController.registerExit);
router.get('/movements', requireRole('ADMIN'), stockController.listMovements);

export default router;