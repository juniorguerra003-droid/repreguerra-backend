import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Usuario no autenticado' });

        const items = await wishlistService.getUserWishlist(userId);
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Usuario no autenticado' });

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: 'Se requiere productId' });

        const item = await wishlistService.addToWishlist(userId, productId);
        res.status(201).json({ success: true, data: item, message: 'Agregado a favoritos' });
    } catch (error) {
        next(error);
    }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Usuario no autenticado' });

        const { productId } = req.params;
        await wishlistService.removeFromWishlist(userId, productId);
        
        res.status(200).json({ success: true, message: 'Eliminado de favoritos' });
    } catch (error) {
        // Ignorar si no existía
        if ((error as any).code === 'P2025') {
             return res.status(200).json({ success: true, message: 'Eliminado de favoritos' });
        }
        next(error);
    }
};
