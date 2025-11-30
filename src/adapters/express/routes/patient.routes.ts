import { PatientController } from '#controllers/patient.controller';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import { Router } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerPatientRoutes(container: DependencyContainer): Router {
  const router = Router();
  const controller = container.resolve(PatientController);

  router.post('/', validateBody(CreatePatientRequestDTO), (req, res) =>
    controller.create(req, res),
  );

  return router;
}
