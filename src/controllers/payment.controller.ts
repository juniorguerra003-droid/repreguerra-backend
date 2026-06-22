import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as paymentService from '../services/payment.service';
import { openpayService } from '../services/openpay.service';
import prisma from '../config/prisma';
export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.processWebhook(req.body);
  
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const processOpenpayCharge = catchAsync(async (req: Request, res: Response) => {
  const { source_id, device_session_id, order_id, customer } = req.body;
  
  if (!source_id || !device_session_id || !order_id || !customer) {
    return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos por Openpay' });
  }

  // 1. Obtener la orden de la base de datos
  const order = await prisma.order.findUnique({
    where: { id: order_id },
    include: { payment: true }
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Orden no encontrada' });
  }

  if (order.estado_pedido !== 'PENDIENTE' && order.estado_pedido !== 'CANCELADO') {
    return res.status(400).json({ success: false, message: 'La orden ya ha sido pagada o procesada' });
  }

  // 2. Procesar el cargo con Openpay
  try {
    const chargeResult = await openpayService.createCharge({
      source_id,
      device_session_id,
      method: 'card',
      amount: Number(order.total),
      currency: 'PEN',
      description: `Pago de Orden #${order.id}`,
      order_id: order.id.substring(0, 45), // Openpay limite de caracteres
      customer: {
        name: customer.name,
        last_name: customer.last_name,
        phone_number: customer.phone_number || '000000000',
        email: customer.email
      }
    });

    // 3. Si es exitoso, actualizar la BD
    if (chargeResult.status === 'completed' || chargeResult.status === 'in_progress') {
      await prisma.$transaction([
        prisma.payment.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            metodo_pago: 'TARJETA',
            estado_pago: chargeResult.status === 'completed' ? 'APROBADO' : 'PENDIENTE',
            transaccion_id: chargeResult.id
          },
          update: {
            metodo_pago: 'TARJETA',
            estado_pago: chargeResult.status === 'completed' ? 'APROBADO' : 'PENDIENTE',
            transaccion_id: chargeResult.id
          }
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { estado_pedido: chargeResult.status === 'completed' ? 'PROCESANDO' : 'PENDIENTE' }
        })
      ]);

      return res.status(200).json({
        success: true,
        message: 'Pago procesado correctamente',
        data: chargeResult
      });
    } else {
      return res.status(400).json({ success: false, message: 'El pago no fue completado', data: chargeResult });
    }
  } catch (error: any) {
    // Manejar error de Openpay (fondos insuficientes, tarjeta rechazada, etc)
    return res.status(402).json({
      success: false,
      message: 'El pago fue rechazado por la pasarela',
      error: error.description || error.message || 'Error desconocido'
    });
  }
});
