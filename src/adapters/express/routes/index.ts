import { authGuard } from '#middlewares/auth-guard.middlewares';
import { registerAuthRoutes } from '#routes/auth.routes';
import { registerMedicRoutes } from '#routes/medic.routes';
import type { Application } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerRoutes(app: Application, container: DependencyContainer): void {
  registerAuthRoutes(app, container);
  app.use('/medics', registerMedicRoutes(container));

  // --------- Me ----------
  app.get('/me', authGuard(container), (req, res) => {
    res.json(req.user);
  });
}
