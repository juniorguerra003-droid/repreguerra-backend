import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().uuid('ID de producto inválido'),
      cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
    })).min(1, 'El pedido debe tener al menos un producto'),
    direccion_envio: z.string().min(5, 'La dirección de envío es requerida'),
    metodo_pago: z.enum(['YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA']),
    comprobante_url: z.string().url().optional(),
  }),
});
