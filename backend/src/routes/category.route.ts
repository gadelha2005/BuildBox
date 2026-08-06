import {Router} from 'express'
import * as categoryController from '../controllers/category.controller';
import {authMiddleware} from '../middlewares/auth.middlware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', categoryController.findAll);

router.use(authMiddleware, requireRole('ADMIN'));

router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;