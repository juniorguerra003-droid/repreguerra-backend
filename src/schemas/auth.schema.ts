import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    tipo_documento: z.enum(['DNI', 'RUC']),
    num_documento: z.string().min(8, 'Documento inválido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    telefono: z.string().optional(),
    rol: z.enum(['ADMIN', 'CLIENTE']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  }),
});
