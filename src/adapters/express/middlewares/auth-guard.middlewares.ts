import { JwtTokenService } from '#services/auth/jwt-token.service';
import { AppError } from '#shared/errors/app-error';
import type { NextFunction, Request, Response } from 'express';
import type { JWTPayload } from 'jose';
import type { DependencyContainer } from 'tsyringe';

declare module 'express-serve-static-core' {
  interface Request {
    user: JWTPayload;
  }
}

export const authGuard = (container: DependencyContainer) => {
  const jwt = container.resolve(JwtTokenService);

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.access_token;
    if (!token) throw new AppError({ message: 'Unauthorized', statusCode: 401 });

    try {
      req.user = await jwt.verifyAccess(token);
      next();
    } catch {
      throw new AppError({ message: 'Unauthorized', statusCode: 401 });
    }
  };
};
