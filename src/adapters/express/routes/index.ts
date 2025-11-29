import { registerAuthRoutes } from '#routes/auth.routes';
import type { Application } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerRoutes(app: Application, container: DependencyContainer): void {
  registerAuthRoutes(app, container);
}
