import { Router } from "express";
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from "../middlewares/auth.middlware";

const router = Router();

router.use(authMiddleware);

router.get('/', cartController.findMine);
router.post('/', cartController.add);
router.patch('/:id', cartController.updateQuantity);
router.delete('/:id', cartController.remove);

export default router;