import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
    estado: z.boolean().optional(),
  }),
});
