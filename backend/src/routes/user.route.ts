import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/', userController.findAll);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/status', userController.updateStatus);

export default router;