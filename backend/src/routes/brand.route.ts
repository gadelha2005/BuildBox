import { Router } from "express";
import * as brandController from '../controllers/brand.controller';
import { authMiddleware } from "../middlewares/auth.middlware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get('/', brandController.findAll);

router.use(authMiddleware, requireRole('ADMIN'));

router.post('/', brandController.create);
router.put('/:id', brandController.update);
router.delete('/:id', brandController.remove);

export default router;