import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';

/**
 * Global error handling middleware
 * Must be registered AFTER all routes
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  });

  // Handle known AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle unknown errors (500 Internal Server Error)
  const statusCode = (err as any).status || (err as any).statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message
  });
}

/**
 * 404 Not Found handler for unmatched routes
 * Register this BEFORE the error handler but AFTER all routes
 */
export function notFoundHandler(req: Request, res: Response) {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method
  });

  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.path}`
  });
}
