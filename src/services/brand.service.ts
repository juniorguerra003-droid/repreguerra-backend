import { PrismaClient, Brand } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBrands = async (includeInactive = false): Promise<Brand[]> => {
  return prisma.brand.findMany({
    where: includeInactive ? undefined : { estado: true },
    orderBy: { nombre: 'asc' },
  });
};

export const getBrandById = async (id: string): Promise<Brand | null> => {
  return prisma.brand.findUnique({
    where: { id },
  });
};

export const createBrand = async (data: { nombre: string; logo_url?: string }): Promise<Brand> => {
  return prisma.brand.create({
    data,
  });
};

export const updateBrand = async (
  id: string,
  data: { nombre?: string; logo_url?: string; estado?: boolean }
): Promise<Brand> => {
  return prisma.brand.update({
    where: { id },
    data,
  });
};

export const deleteBrand = async (id: string): Promise<void> => {
  // Soft delete o hard delete. Vamos a hacer hard delete para este ejemplo si no hay productos, o simplemente borrar
  await prisma.brand.delete({
    where: { id },
  });
};
