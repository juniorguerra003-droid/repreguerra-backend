import prisma from '../config/prisma';
import { z } from 'zod';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

type CreateInput = z.infer<typeof createCategorySchema>['body'];
type UpdateInput = z.infer<typeof updateCategorySchema>['body'];

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    const error: any = new Error('Categoría no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const createCategory = async (data: CreateInput) => {
  return prisma.category.create({
    data,
  });
};

export const updateCategory = async (id: string, data: UpdateInput) => {
  await getCategoryById(id); // Ensure exists

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  await getCategoryById(id); // Ensure exists
  
  // Note: Prisma will throw P2003 if there are products with this category
  // due to 'Restrict' on the relationship. The global error handler could catch it.
  return prisma.category.delete({
    where: { id },
  });
};
