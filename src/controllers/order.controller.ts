import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as orderService from '../services/order.service';

export const checkout = catchAsync(async (req: Request, res: Response) => {
  // User is authenticated, so req.user exists
  const order = await orderService.checkout(req.user!.id, req.body);
  
  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
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
