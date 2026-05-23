import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // If it's a Zod validation error, return 400 with details
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors,
    });
  }

  // General known errors (example: Prisma unique constraint)
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Un registro con este valor ya existe (Unique Constraint).',
    });
  }

  // Default to 500 for unhandled errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Do not expose stack trace in production
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
