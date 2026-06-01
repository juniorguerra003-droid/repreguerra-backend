import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import brandRoutes from './routes/brand.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import bannerRoutes from './routes/banner.routes';
import wishlistRoutes from './routes/wishlist.routes';
import complaintRoutes from './routes/complaint.routes';
import uploadRoutes from './routes/upload.routes';
import path from 'path';

const app: Application = express();

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Permite cargar imágenes desde otro origen
app.use(cors());
app.use(express.json());

// Archivos Estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'E-commerce API is running' });
});

// Routes definition
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
