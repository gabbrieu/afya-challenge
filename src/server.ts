import { registerRoutes } from '#routes/index';
import cookieParser from 'cookie-parser';
import express, { type Express, json } from 'express';
import type { DependencyContainer } from 'tsyringe';
// import { errorHandler } from './interfaces/http/express/middlewares/error-handler';

export function createServer(container: DependencyContainer): Express {
  const app = express();
  app.use(json());
  app.use(cookieParser());

  registerRoutes(app, container);

  // app.use(errorHandler);
  return app;
}
