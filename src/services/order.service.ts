import prisma from '../config/prisma';
import { z } from 'zod';
import { createOrderSchema } from '../schemas/order.schema';

type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];

export const checkout = async (userId: string, data: CreateOrderInput) => {
  // Prisma transaction to ensure atomicity
  return await prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItemsData = [];

    // Validate stock and calculate total from DB
    for (const item of data.items) {
      // Find the product and lock it implicitly in Postgres
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.estado) {
        const error: any = new Error(`Producto no encontrado o inactivo: ${item.productId}`);
        error.statusCode = 404;
        throw error;
      }

      if (product.stock < item.cantidad) {
        const error: any = new Error(`Stock insuficiente para el producto: ${product.nombre}`);
        error.statusCode = 400;
        throw error;
      }

      // Decrement stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.cantidad } },
      });

      // Calculate historical price subtotal
      const precioUnitario = Number(product.precio);
      total += precioUnitario * item.cantidad;

      orderItemsData.push({
        productId: product.id,
        cantidad: item.cantidad,
        precio_unitario: product.precio,
      });
    }

    // Create the Order along with OrderItems and Payment (Pending state)
    const order = await tx.order.create({
      data: {
        userId,
        direccion_envio: data.direccion_envio,
        total,
        estado_pedido: 'PENDIENTE',
        orderItems: {
          create: orderItemsData,
        },
        payment: {
          create: {
            metodo_pago: data.metodo_pago,
            estado_pago: 'PENDIENTE',
          },
        },
      },
      include: {
        orderItems: true,
        payment: true,
      },
    });

    return order;
  });
};

export const getOrderById = async (id: string, userId: string, role: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: { include: { product: true } },
      payment: true,
    },
  });

  if (!order) {
    const error: any = new Error('Pedido no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Ensure user owns order or is admin
  if (order.userId !== userId && role !== 'ADMIN') {
    const error: any = new Error('Acceso denegado');
    error.statusCode = 403;
    throw error;
  }

  return order;
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true,
      payment: true,
    },
  });
};
