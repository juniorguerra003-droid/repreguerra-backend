import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createProductSchema, updateProductSchema, getProductsQuerySchema, createBulkProductSchema } from '../schemas/product.schema';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', validate(getProductsQuerySchema), productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes (Desactivado temporalmente para pruebas)
 router.use(authenticate); 

router.post('/bulk', requireRole(['SUPER_ADMIN', 'VENDEDOR']), validate(createBulkProductSchema), productController.createBulk);
router.post('/', requireRole(['SUPER_ADMIN', 'VENDEDOR']), validate(createProductSchema), productController.create);
router.patch('/:id', requireRole(['SUPER_ADMIN', 'VENDEDOR']), validate(updateProductSchema), productController.update);
router.delete('/:id', requireRole(['SUPER_ADMIN']), productController.remove);

export default router;
