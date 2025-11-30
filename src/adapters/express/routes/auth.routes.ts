import { AuthController } from '#controllers/auth.controller';
import { authGuard } from '#middlewares/auth-guard.middlewares';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { LoginRequestDTO } from '#usecases/auth/login/login.dto';
import { Router } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerAuthRoutes(container: DependencyContainer): Router {
  const router = Router();
  const controller = container.resolve(AuthController);

  router.post('/login', validateBody(LoginRequestDTO), (req, res) => controller.login(req, res));
  router.post('/logout', authGuard(container), (_, res) => controller.logout(res));
  router.post('/refresh', (req, res) => controller.refresh(req, res));

  return router;
}
