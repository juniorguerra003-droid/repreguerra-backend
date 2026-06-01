import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas de wishlist requieren autenticación
router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
