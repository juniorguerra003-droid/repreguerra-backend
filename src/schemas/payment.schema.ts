import { z } from 'zod';

export const webhookSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('ID de orden inválido'),
    transaccion_id: z.string().min(1, 'ID de transacción requerido'),
    estado: z.enum(['APROBADO', 'FALLIDO']),
  }),
});
