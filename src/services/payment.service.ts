import prisma from '../config/prisma';
import { z } from 'zod';
import { webhookSchema } from '../schemas/payment.schema';

type WebhookInput = z.infer<typeof webhookSchema>['body'];

export const processWebhook = async (data: WebhookInput) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { orderId: data.orderId },
    });

    if (!payment) {
      const error: any = new Error('Pago no encontrado para esta orden');
      error.statusCode = 404;
      throw error;
    }

    if (payment.estado_pago === 'APROBADO') {
      return { message: 'El pago ya fue procesado anteriormente' };
    }

    // Actualizar estado del pago
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        estado_pago: data.estado,
        transaccion_id: data.transaccion_id,
      },
    });

    // Si el pago es aprobado, actualizar la orden a PROCESANDO
    if (data.estado === 'APROBADO') {
      await tx.order.update({
        where: { id: data.orderId },
        data: { estado_pedido: 'PROCESANDO' },
      });
    }

    return { message: 'Webhook procesado correctamente', status: data.estado };
  });
};
