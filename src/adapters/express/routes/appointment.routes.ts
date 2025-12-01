import { AppointmentController } from '#controllers/appointment.controller';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import { Router } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerAppointmentRoutes(container: DependencyContainer): Router {
  const router = Router();
  const controller = container.resolve(AppointmentController);

  router.post('/', validateBody(CreateAppointmentRequestDTO), (req, res) =>
    controller.create(req, res),
  );

  return router;
}
