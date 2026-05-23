import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  
  res.status(200).json({
    success: true,
    data: result,
  });
});

// Example of a protected endpoint (get current profile)
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
