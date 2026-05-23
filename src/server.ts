import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import prisma from './config/prisma';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('✅ Base de datos conectada exitosamente');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando conexiones...');
  await prisma.$disconnect();
  process.exit(0);
});
