import {Router} from 'express'
import * as categoryController from '../controllers/category.controller';
import {authMiddleware} from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', categoryController.findAll);
router.post('/', authMiddleware, requireRole('ADMIN'), categoryController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN'), categoryController.update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), categoryController.remove);

export default router;