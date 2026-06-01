import { Router } from 'express';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaint.controller';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/complaints (Público, para clientes)
router.post('/', createComplaint);

// GET /api/complaints (Admin)
router.get('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), getComplaints);

// PATCH /api/complaints/:id/status (Admin)
router.patch('/:id/status', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), updateComplaintStatus);

export default router;
