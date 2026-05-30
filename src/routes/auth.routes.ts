import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', validate(updateProfileSchema), authenticate, authController.updateProfile);

export default router;
