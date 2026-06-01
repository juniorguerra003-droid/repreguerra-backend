import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema';

type RegisterInput = z.infer<typeof registerSchema>['body'];
type LoginInput = z.infer<typeof loginSchema>['body'];
type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];

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

  const token = generateToken({ id: user.id, rol: user.rol });

  return {
    user: {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      direccion_defecto: user.direccion_defecto,
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

  const token = generateToken({ id: user.id, rol: user.rol });

  return {
    user: {
      id: user.id,
      nombre: user.nombre_completo,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      direccion_defecto: user.direccion_defecto,
    },
    token,
  };
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      telefono: data.telefono,
      direccion_defecto: data.direccion_defecto,
    },
  });

  return {
    id: user.id,
    nombre: user.nombre_completo,
    email: user.email,
    rol: user.rol,
    telefono: user.telefono,
    direccion_defecto: user.direccion_defecto,
  };
};
