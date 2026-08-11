import { Router } from "express";
import * as productController from '../controllers/product.controller';
import { authMiddleware } from "../middlewares/auth.middlware";
import { requireRole } from "../middlewares/role.middleware";
import * as photoController from '../controllers/photo.controller';
import * as variantController from '../controllers/variant.controller';


const router = Router();

router.get('/', productController.findAll);
router.get('/admin', authMiddleware, requireRole('ADMIN'), productController.findAllAdmin);
router.get('/:id', productController.findById);

router.use(authMiddleware, requireRole('ADMIN'));

router.post('/', productController.create);
router.put('/:id', productController.update);
router.patch('/:id/deactivate', productController.deactivate);
router.patch('/:id/activate', productController.activate);
router.delete('/:id', productController.remove);
router.post('/:id/photos', photoController.add);
router.delete('/:id/photos/:photoId', photoController.remove);
router.post('/:id/variants', variantController.add);

export default router;