import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createBrandSchema, updateBrandSchema } from '../schemas/brand.schema';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Públicas (o para usuarios autenticados)
router.get('/', brandController.getBrands);

// Privadas (Solo Admin)
router.post('/', authenticate, requireAdmin, validate(createBrandSchema), brandController.createBrand);
router.patch('/:id', authenticate, requireAdmin, validate(updateBrandSchema), brandController.updateBrand);
router.delete('/:id', authenticate, requireAdmin, brandController.deleteBrand);

export default router;
