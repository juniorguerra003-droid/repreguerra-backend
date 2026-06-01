import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin only routes
router.use(authenticate, requireRole(['SUPER_ADMIN', 'VENDEDOR']));
router.post('/', validate(createCategorySchema), categoryController.create);
router.patch('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
