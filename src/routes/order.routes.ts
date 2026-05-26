import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createOrderSchema } from '../schemas/order.schema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// RUTA PÚBLICA: Checkout de Invitados
// ==========================================
router.post('/checkout', validate(createOrderSchema), orderController.checkout);

// ==========================================
// RUTAS PRIVADAS: El guardia
// ==========================================
router.use(authenticate); 

// 👇 RUTA PROTEGIDA: Solo el administrador con token puede entrar
// ¡ESTA ES LA NUEVA RUTA DEL DASHBOARD!
router.get('/admin/stats', orderController.getDashboardStats);

router.get('/admin/all', orderController.getAllOrdersForAdmin);
router.patch('/admin/:id/status', orderController.updateOrderStatus);

// RUTAS DE USUARIO
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;