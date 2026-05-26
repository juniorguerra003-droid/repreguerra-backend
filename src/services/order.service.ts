import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const checkout = async (body: any, userId?: string) => {
    const { items, direccion_envio } = body;

    if (!items || items.length === 0) {
        throw new Error('El carrito no puede estar vacío.');
    }

    // Ejecutamos la transacción blindada
    const nuevoPedido = await prisma.$transaction(async (tx) => {
        let totalAcumulado = 0;
        const itemsParaGuardar = [];

// 1. Validar stock real y recalcular precios
        for (const item of items) {
            const productoReal = await tx.product.findUnique({
                where: { id: item.productId } // <-- ¡Cambiamos item.id por item.productId!
            });

            if (!productoReal || !productoReal.estado) {
                throw new Error(`El producto ${item.nombre || 'desconocido'} ya no está disponible.`);
            }

            if (productoReal.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para ${productoReal.nombre}. Quedan ${productoReal.stock}.`);
            }

            const precioUnitario = Number(productoReal.precio);
            totalAcumulado += precioUnitario * item.cantidad;

            itemsParaGuardar.push({
                productId: productoReal.id,
                cantidad: item.cantidad,
                precio_unitario: productoReal.precio
            });

            // 2. Descontar el stock inmediatamente
            await tx.product.update({
                where: { id: productoReal.id },
                data: { stock: productoReal.stock - item.cantidad }
            });
        }

        // 3. Crear la Orden (con o sin usuario)
        const order = await tx.order.create({
            data: {
                userId: userId || null, // Si es invitado, queda en null
                total: totalAcumulado,
                direccion_envio: direccion_envio || 'No especificada',
                estado_pedido: 'PENDIENTE',
                orderItems: {
                    create: itemsParaGuardar
                }
            },
            include: {
                orderItems: true
            }
        });

        // 4. Crear el registro de Pago
        await tx.payment.create({
            data: {
                orderId: order.id,
                metodo_pago: 'TARJETA', 
                estado_pago: 'PENDIENTE'
            }
        });

        return order;
    });

    return nuevoPedido;
};

// --- MÉTODOS DE HISTORIAL (Mantenemos la estructura) ---
export const getUserOrders = async (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include: { orderItems: { include: { product: true } }, payment: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const getOrderById = async (orderId: string, userId: string, userRol: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: { include: { product: true } }, payment: true }
    });

    if (!order) throw new Error('Pedido no encontrado');
    
    // Si no es admin y el pedido no es suyo, bloqueamos
    if (userRol !== 'ADMIN' && order.userId !== userId) {
        throw new Error('No tienes permiso para ver este pedido');
    }

    return order;
};

export const getAllOrders = async () => {
    return prisma.order.findMany({
        include: { 
            orderItems: { include: { product: true } }, 
            payment: true,
            user: true 
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const updateOrderStatus = async (id: string, nuevoEstado: string) => {
    return prisma.order.update({
        where: { id: id },
        data: { estado_pedido: nuevoEstado as OrderStatus } // 2. Agregamos el "as OrderStatus"
    });
};

export const getDashboardStats = async () => {
    // 1. Calculamos el total de ingresos (usando el objeto OrderStatus oficial)
    const ingresos = await prisma.order.aggregate({
        _sum: { total: true },
        where: { estado_pedido: { not: OrderStatus.CANCELADO } } // <-- Corrección 1
    });

    // 2. Contamos cuántos pedidos hay en total
    const totalPedidos = await prisma.order.count();

    // 3. Agrupamos y contamos los pedidos por estado
    const pedidosPorEstado = await prisma.order.groupBy({
        by: ['estado_pedido'],
        _count: { estado_pedido: true }
    });

    return {
        // Usamos el signo de interrogación (?) para evitar el error de undefined
        ingresosTotales: ingresos._sum?.total || 0, // <-- Corrección 2
        pedidosTotales: totalPedidos,
        resumenEstados: pedidosPorEstado.map(item => ({
            estado: item.estado_pedido,
            cantidad: item._count.estado_pedido
        }))
    };
};