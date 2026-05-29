import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';

const prisma = new PrismaClient();

// GET /api/banners — público: solo banners activos
export const getActiveBanners = catchAsync(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({
    where: { activo: true },
    orderBy: { orden: 'asc' },
  });
  res.json({ success: true, data: banners });
});

// GET /api/banners/admin — admin: todos los banners
export const getAllBanners = catchAsync(async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({ orderBy: { orden: 'asc' } });
  res.json({ success: true, data: banners });
});

// POST /api/banners/admin — admin: crear banner
export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const { titulo, imagen_url, enlace_opcional, orden } = req.body;
  if (!titulo || !imagen_url) {
    return res.status(400).json({ success: false, message: 'titulo e imagen_url son requeridos' });
  }
  const banner = await prisma.banner.create({
    data: {
      titulo,
      imagen_url,
      enlace_opcional: enlace_opcional ?? null,
      orden: orden ?? 0,
      activo: true,
    },
  });
  res.status(201).json({ success: true, data: banner });
});

// PATCH /api/banners/admin/:id — admin: actualizar banner (activo, titulo, enlace, orden)
export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { activo, titulo, enlace_opcional, orden } = req.body;
  const banner = await prisma.banner.update({
    where: { id },
    data: {
      ...(activo !== undefined && { activo }),
      ...(titulo !== undefined && { titulo }),
      ...(enlace_opcional !== undefined && { enlace_opcional }),
      ...(orden !== undefined && { orden }),
    },
  });
  res.json({ success: true, data: banner });
});

// DELETE /api/banners/admin/:id — admin: eliminar banner
export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.banner.delete({ where: { id } });
  res.json({ success: true, message: 'Banner eliminado correctamente' });
});
