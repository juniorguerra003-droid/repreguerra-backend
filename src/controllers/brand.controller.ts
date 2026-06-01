import { Request, Response, NextFunction } from 'express';
import * as brandService from '../services/brand.service';

export const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.user?.rol === 'ADMIN';
    const brands = await brandService.getAllBrands(includeInactive);
    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const brand = await brandService.updateBrand(id, req.body);
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await brandService.deleteBrand(id);
    res.json({ success: true, message: 'Marca eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
