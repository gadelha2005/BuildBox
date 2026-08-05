import { Router } from "express";
import * as productController from '../controllers/product.controller';
import { authMiddleware } from "../middlewares/auth.middlware";
import { requireRole } from "../middlewares/role.middleware";


const router = Router();

router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.post('/', authMiddleware, requireRole('ADMIN'), productController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN'), productController.update);
router.patch('/:id/deactivate', authMiddleware, requireRole('ADMIN'), productController.deactivate);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), productController.remove);

export default router;