import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createOrderSchema } from '../schemas/order.schema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.post('/checkout', validate(createOrderSchema), orderController.checkout);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;
