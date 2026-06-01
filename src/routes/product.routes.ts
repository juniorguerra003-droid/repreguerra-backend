import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createProductSchema, updateProductSchema, getProductsQuerySchema, createBulkProductSchema } from '../schemas/product.schema';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', validate(getProductsQuerySchema), productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes (Desactivado temporalmente para pruebas)
 router.use(authenticate, requireAdmin); 

router.post('/bulk', validate(createBulkProductSchema), productController.createBulk);
router.post('/', validate(createProductSchema), productController.create);
router.patch('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', productController.remove);

export default router;
