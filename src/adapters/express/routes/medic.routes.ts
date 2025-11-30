import { MedicController } from '#controllers/medic.controller';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';
import { Router } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerMedicRoutes(container: DependencyContainer): Router {
  const router = Router();
  const controller = container.resolve(MedicController);

  router.post('/', validateBody(CreateMedicRequestDTO), (req, res) => controller.create(req, res));

  return router;
}
