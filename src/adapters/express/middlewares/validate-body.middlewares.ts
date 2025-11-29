// src/adapters/express/middlewares/validate-body.middlewares.ts
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { type NextFunction, type Request, type Response } from 'express';

export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    req.body = dto;
    next();
  };
}
