import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validate } from '../middlewares/validateMiddleware';
import { webhookSchema } from '../schemas/payment.schema';

const router = Router();

// Endpoint público simulado para recibir el webhook (ej. de Yape o Niubiz)
router.post('/webhook', validate(webhookSchema), paymentController.handleWebhook);
router.post('/openpay', paymentController.processOpenpayCharge);

export default router;
