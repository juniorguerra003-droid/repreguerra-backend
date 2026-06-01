import prisma from '../config/prisma';

export const getUserWishlist = async (userId: string) => {
    return prisma.wishlist.findMany({
        where: { userId },
        include: {
            product: {
                include: { category: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const addToWishlist = async (userId: string, productId: string) => {
    return prisma.wishlist.upsert({
        where: {
            userId_productId: {
                userId,
                productId
            }
        },
        update: {},
        create: {
            userId,
            productId
        },
        include: { product: true }
    });
};

export const removeFromWishlist = async (userId: string, productId: string) => {
    return prisma.wishlist.delete({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });
};
