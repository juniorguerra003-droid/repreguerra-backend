import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as orderService from '../services/order.service';

export const checkout = catchAsync(async (req: Request, res: Response) => {
  // Al usar (req as any), TypeScript nos deja pasar sin rayitas rojas
  const userId = (req as any).user?.id; 
  
  const order = await orderService.checkout(req.body, userId);
  
  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  // Aquí sí exigimos que esté logueado porque quiere ver "sus" pedidos históricos
  const orders = await orderService.getUserOrders(req.user!.id);
  
  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.user!.id, req.user!.rol);
  
  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getAllOrdersForAdmin = catchAsync(async (req: Request, res: Response) => {
  console.log("🚨 ALERTA: Llegamos al controlador sin seguridad");

  // COMENTAMOS ESTO TEMPORALMENTE PARA LA PRUEBA
  
  const userRole = (req as any).user?.rol;
  if (userRole !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Acceso denegado.' });
    return;
  }
  

  const orders = await orderService.getAllOrders();
  
  res.status(200).json({ 
    success: true, 
    data: orders 
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  // 1. Verificamos rol
  const userRole = (req as any).user?.rol;
  if (userRole !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Acceso denegado. No eres administrador.' });
    return;
  }

  // 2. Extraemos el ID de la URL y el estado del cuerpo de la petición
  const { id } = req.params;
  const { estado } = req.body; 

  // 3. Actualizamos en la base de datos
  const updatedOrder = await orderService.updateOrderStatus(id, estado);
  
  res.status(200).json({ 
    success: true, 
    data: updatedOrder,
    message: `Pedido actualizado a ${estado}`
  });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const userRole = (req as any).user?.rol;
    if (userRole !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Acceso denegado.' });
        return;
    }

    const stats = await orderService.getDashboardStats();
    
    res.status(200).json({ 
        success: true, 
        data: stats 
    });
});

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const userRole = (req as any).user?.rol;
  if (userRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Acceso denegado.' });
      return;
  }

  const analytics = await orderService.getWeeklyAnalytics();
  
  res.status(200).json({ 
      success: true, 
      data: analytics 
  });
});