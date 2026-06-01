import prisma from '../config/prisma';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

type CreateInput = z.infer<typeof createProductSchema>['body'];
type UpdateInput = z.infer<typeof updateProductSchema>['body'];

export const getAllProducts = async (filters: { categoryId?: string; search?: string }) => {
  const whereClause: any = { estado: true };

  if (filters.categoryId) {
    whereClause.categoryId = filters.categoryId;
  }

  if (filters.search) {
    whereClause.nombre = {
      contains: filters.search,
      mode: 'insensitive', // PostgreSQL only
    };
  }

  return prisma.product.findMany({
    where: whereClause,
    include: {
      category: {
        select: { id: true, nombre: true }
      },
      brand: true
    }
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      brand: true 
    },
  });

  if (!product) {
    const error: any = new Error('Producto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const createProduct = async (data: CreateInput) => {
  return prisma.product.create({
    data,
  });
};

export const createBulkProducts = async (data: any[]) => {
  return prisma.product.createMany({
    data,
    skipDuplicates: true, // Ignora los SKUs que ya existen
  });
};

export const updateProduct = async (id: string, data: UpdateInput) => {
  await getProductById(id);

  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);
  
  // Logical delete (soft delete)
  return prisma.product.update({
    where: { id },
    data: { estado: false },
  });
};
