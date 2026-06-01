import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const checkout = async (body: any, userId?: string) => {
    const { items, direccion_envio, comprobante_url } = body;

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
                metodo_pago: body.metodo_pago || 'TARJETA',
                estado_pago: 'PENDIENTE',
                ...(comprobante_url ? { comprobante_url } : {}),
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

export const getWeeklyAnalytics = async () => {
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    // Obtener los pedidos de los últimos 7 días
    const pedidos = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: sieteDiasAtras
            }
        },
        select: {
            createdAt: true,
            total: true,
            estado_pedido: true
        }
    });

    // Agrupar por fecha para el gráfico de barras (Ventas por día)
    const ventasPorDiaMap = new Map<string, { fecha: string, total: number, cantidad: number }>();
    
    // Inicializar los últimos 7 días en el map
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const fechaStr = d.toISOString().split('T')[0];
        ventasPorDiaMap.set(fechaStr, { fecha: fechaStr, total: 0, cantidad: 0 });
    }

    // Agrupar por estado para el gráfico (Estado de Pedidos)
    const pedidosPorEstadoMap = new Map<string, number>();

    pedidos.forEach(p => {
        const fechaStr = p.createdAt.toISOString().split('T')[0];
        
        // Acumular ventas por día
        if (ventasPorDiaMap.has(fechaStr) && p.estado_pedido !== 'CANCELADO') {
            const current = ventasPorDiaMap.get(fechaStr)!;
            current.total += Number(p.total);
            current.cantidad += 1;
        }

        // Acumular pedidos por estado
        const estado = p.estado_pedido;
        pedidosPorEstadoMap.set(estado, (pedidosPorEstadoMap.get(estado) || 0) + 1);
    });

    const ventasPorDia = Array.from(ventasPorDiaMap.values());
    const pedidosPorEstado = Array.from(pedidosPorEstadoMap.entries()).map(([estado, cantidad]) => ({
        estado,
        cantidad
    }));

    return {
        ventasPorDia,
        pedidosPorEstado
    };
};