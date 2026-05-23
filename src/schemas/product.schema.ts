import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('ID de categoría inválido'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser un número positivo'),
    stock: z.number().int().nonnegative('El stock no puede ser negativo').optional(),
    imagen_url: z.string().url('URL de imagen inválida').optional(),
    estado: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    categoryId: z.string().uuid().optional(),
    nombre: z.string().min(2).optional(),
    sku: z.string().min(3).optional(),
    descripcion: z.string().optional(),
    precio: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    imagen_url: z.string().url().optional(),
    estado: z.boolean().optional(),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    categoryId: z.string().uuid('ID de categoría inválido').optional(),
    search: z.string().optional(),
  }),
});
