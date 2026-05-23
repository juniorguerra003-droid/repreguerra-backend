import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as paymentService from '../services/payment.service';

export const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.processWebhook(req.body);
  
  res.status(200).json({
    success: true,
    data: result,
  });
});
