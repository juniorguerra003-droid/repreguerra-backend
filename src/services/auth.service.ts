import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

type RegisterInput = z.infer<typeof registerSchema>['body'];
type LoginInput = z.infer<typeof loginSchema>['body'];

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error: any = new Error('El correo electrónico ya está registrado');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      nombre_completo: data.nombre_completo,
      tipo_documento: data.tipo_documento,
      num_documento: data.num_documento,
      email: data.email,
      password_hash: hashedPassword,
      telefono: data.telefono,
      rol: data.rol || 'CLIENTE',
    },
  });

  const token = generateToken({ id: user.id, rol: user.rol as 'ADMIN' | 'CLIENTE' });

  return {
    user: {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      rol: user.rol,
    },
    token,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    const error: any = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await comparePassword(data.password, user.password_hash);

  if (!isValidPassword) {
    const error: any = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user.id, rol: user.rol as 'ADMIN' | 'CLIENTE' });

  return {
    user: {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      rol: user.rol,
    },
    token,
  };
};
