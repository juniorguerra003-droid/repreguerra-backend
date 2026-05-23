import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as categoryService from '../services/category.service';

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  
  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: category,
  });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  
  res.status(201).json({
    success: true,
    data: category,
  });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    data: category,
  });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  
  res.status(204).send();
});
