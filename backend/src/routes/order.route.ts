import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', orderController.checkout);
router.get('/me', orderController.findMine);
router.get('/me/:id', orderController.findMineById);

router.use(requireRole('FUNCIONARIO', 'ADMIN'));

router.get('/', orderController.findAll);
router.get('/:id', orderController.findById);
router.patch('/:id/status', orderController.updateStatus);
router.patch('/:id/cancel', requireRole('ADMIN'), orderController.cancel);

export default router;