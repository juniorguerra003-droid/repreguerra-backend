import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Asegurarse de que el directorio de uploads existe
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes'));
  }
});

// Ruta para subir imagen (solo accesible para admin o vendedores autorizados)
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'VENDEDOR']), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ninguna imagen' });
    }

    // Devolver la URL pública del archivo subido
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url: imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al subir la imagen' });
  }
});

export default router;
