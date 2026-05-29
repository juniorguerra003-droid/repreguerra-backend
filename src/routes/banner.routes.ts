import { Router } from 'express';
import * as bannerController from '../controllers/banner.controller';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// ── Pública ───────────────────────────────
router.get('/', bannerController.getActiveBanners);

// ── Admin (requiere JWT de administrador) ──
router.use(authenticate, requireAdmin);
router.get('/admin', bannerController.getAllBanners);
router.post('/admin', bannerController.createBanner);
router.patch('/admin/:id', bannerController.updateBanner);
router.delete('/admin/:id', bannerController.deleteBanner);

export default router;
