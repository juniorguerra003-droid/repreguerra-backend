import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    estado: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    estado: z.boolean().optional(),
  }),
});
