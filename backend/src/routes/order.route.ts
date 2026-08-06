import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middlware';

const router = Router();

router.use(authMiddleware);

router.post('/', orderController.checkout);

export default router;