import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createOrderSchema } from '../schemas/order.schema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// RUTA PÚBLICA: Checkout de Invitados
// ¡Cualquiera puede comprar!
// ==========================================
router.post('/checkout', validate(createOrderSchema), orderController.checkout);

// ==========================================
// RUTAS PRIVADAS: Solo para usuarios registrados
// El "guardia" se pone aquí para proteger el historial
// ==========================================
router.use(authenticate); 
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;