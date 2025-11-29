import { AppError } from '#shared/errors/app-error';
import { type NextFunction, type Request, type Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  const message = err instanceof Error ? err.message : 'Unexpected error';
  return res.status(500).json({ message });
}
