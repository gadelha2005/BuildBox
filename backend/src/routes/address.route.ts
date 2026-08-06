import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/auth.middlware';

const router = Router();

router.use(authMiddleware);

router.get('/', addressController.findMine);
router.post('/', addressController.create);
router.put('/:id', addressController.update);
router.delete('/:id', addressController.remove);

export default router;