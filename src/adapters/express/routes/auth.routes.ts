import { AuthController } from '#controllers/auth.controller';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { LoginRequestDTO } from '#usecases/auth/login.dto';
import { LoginUseCase } from '#usecases/auth/login.usecases';
import type { Application } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerAuthRoutes(app: Application, container: DependencyContainer): void {
  container.register('LoginUseCasePort', {
    useClass: LoginUseCase,
  });
  const controller = container.resolve(AuthController);

  app.post('/login', validateBody(LoginRequestDTO), (req, res) => controller.login(req, res));
  app.post('/logout', (_, res) => controller.logout(res));
}
