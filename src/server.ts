import { swaggerUiOptions } from '#config/swagger';
import { swaggerSpec } from '#docs/index';
import { errorHandler } from '#middlewares/error-handler.middlewares';
import { registerRoutes } from '#routes/index';
import cookieParser from 'cookie-parser';
import express, { type Express, json } from 'express';
import swaggerUi from 'swagger-ui-express';
import type { DependencyContainer } from 'tsyringe';

export function createServer(container: DependencyContainer): Express {
  const app = express();
  app.use(json());
  app.use(cookieParser());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

  registerRoutes(app, container);

  app.use(errorHandler);

  return app;
}
