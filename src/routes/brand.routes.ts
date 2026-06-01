import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createBrandSchema, updateBrandSchema } from '../schemas/brand.schema';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Públicas (o para usuarios autenticados)
router.get('/', brandController.getBrands);

// Privadas (Solo Admin)
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'VENDEDOR']), validate(createBrandSchema), brandController.createBrand);
router.patch('/:id', authenticate, requireRole(['SUPER_ADMIN', 'VENDEDOR']), validate(updateBrandSchema), brandController.updateBrand);
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'VENDEDOR']), brandController.deleteBrand);

export default router;
