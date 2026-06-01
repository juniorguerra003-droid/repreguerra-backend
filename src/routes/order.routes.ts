import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validateMiddleware';
import { createOrderSchema } from '../schemas/order.schema';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// RUTA PROTEGIDA: Checkout requiere cuenta
// ==========================================
router.post('/checkout', authenticate, validate(createOrderSchema), orderController.checkout);

// ==========================================
// RUTAS PRIVADAS: El guardia
// ==========================================
router.use(authenticate); 

// 👇 RUTA PROTEGIDA: Solo el administrador con token puede entrar
// ¡ESTA ES LA NUEVA RUTA DEL DASHBOARD!
router.get('/admin/stats', requireRole(['SUPER_ADMIN']), orderController.getDashboardStats);
router.get('/admin/analytics', requireRole(['SUPER_ADMIN']), orderController.getAnalytics);

router.get('/admin/all', requireRole(['SUPER_ADMIN', 'VENDEDOR']), orderController.getAllOrdersForAdmin);
router.patch('/admin/:id/status', requireRole(['SUPER_ADMIN', 'VENDEDOR']), orderController.updateOrderStatus);

// RUTAS DE USUARIO
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;