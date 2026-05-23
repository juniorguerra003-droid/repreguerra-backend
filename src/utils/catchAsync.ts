import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper for async route handlers to catch exceptions
 * and pass them to the global error handler middleware.
 */
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
