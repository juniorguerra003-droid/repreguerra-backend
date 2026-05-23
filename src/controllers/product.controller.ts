import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as productService from '../services/product.service';

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    categoryId: req.query.categoryId as string | undefined,
    search: req.query.search as string | undefined,
  };

  const products = await productService.getAllProducts(filters);
  
  res.status(200).json({
    success: true,
    data: products,
  });
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: product,
  });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  
  res.status(201).json({
    success: true,
    data: product,
  });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    data: product,
  });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  
  res.status(204).send();
});
