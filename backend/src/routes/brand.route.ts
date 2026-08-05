import { Router } from "express";
import * as brandController from '../controllers/brand.controller';
import { authMiddleware } from "../middlewares/auth.middlware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get('/', brandController.findAll);
router.post('/', authMiddleware, requireRole('ADMIN'), brandController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN'), brandController.update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), brandController.remove);

export default router;