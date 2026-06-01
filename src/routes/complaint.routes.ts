import { Router } from 'express';
import { createComplaint } from '../controllers/complaint.controller';

const router = Router();

// POST /api/complaints
router.post('/', createComplaint);

export default router;
