import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
