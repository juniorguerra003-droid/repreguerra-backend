import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('ID de categoría inválido'),
    brandId: z.string().uuid('ID de marca inválido').optional().nullable(),
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres'),
    descripcion: z.string().optional().nullable(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    enOferta: z.boolean().optional(),
    precioOferta: z.number().positive('El precio de oferta debe ser mayor a 0').optional().nullable(),
    mostrarPrecio: z.boolean().optional(),
    stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
    imagen_url: z.string().url('URL de imagen inválida').optional(),
    estado: z.boolean().optional(),
  }),
});

export const createBulkProductSchema = z.object({
  body: z.array(
    z.object({
      categoryId: z.string().uuid('ID de categoría inválido'),
      brandId: z.string().uuid('ID de marca inválido').optional().nullable(),
      nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
      sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres'),
      descripcion: z.string().optional().nullable(),
      precio: z.number().positive('El precio debe ser mayor a 0'),
      enOferta: z.boolean().optional(),
      precioOferta: z.number().positive('El precio de oferta debe ser mayor a 0').optional().nullable(),
      mostrarPrecio: z.boolean().optional(),
      stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
      imagen_url: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
      estado: z.boolean().optional(),
    })
  ).min(1, 'Debe enviar al menos un producto'),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    categoryId: z.string().uuid('ID de categoría inválido').optional(),
    brandId: z.string().uuid('ID de marca inválido').optional().nullable(),
    nombre: z.string().min(3).optional(),
    sku: z.string().min(3).optional(),
    descripcion: z.string().optional().nullable(),
    precio: z.number().positive().optional(),
    enOferta: z.boolean().optional(),
    precioOferta: z.number().positive().optional().nullable(),
    mostrarPrecio: z.boolean().optional(),
    stock: z.number().int().min(0).optional(),
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
