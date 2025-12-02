import { AppointmentController } from '#controllers/appointment.controller';
import { validateBody } from '#middlewares/validate-body.middlewares';
import { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';
import { CreateNoteRequestDTO } from '#usecases/note/create/create-note.dto';
import { UpdateNoteRequestDTO } from '#usecases/note/update/update-note.dto';
import { Router } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerAppointmentRoutes(container: DependencyContainer): Router {
  const router = Router();
  const controller = container.resolve(AppointmentController);

  router.post('/', validateBody(CreateAppointmentRequestDTO), (req, res) =>
    controller.create(req, res),
  );
  router.get('/', (req, res) => controller.list(req, res));
  router.patch('/:id', validateBody(UpdateAppointmentRequestDTO), (req, res) =>
    controller.update(req, res),
  );
  router.delete('/:id', (req, res) => controller.delete(req, res));
  router.post('/:id/notes', validateBody(CreateNoteRequestDTO), (req, res) =>
    controller.addNote(req, res),
  );
  router.get('/:id/notes', (req, res) => controller.getNote(req, res));
  router.patch('/:id/notes', validateBody(UpdateNoteRequestDTO), (req, res) =>
    controller.updateNote(req, res),
  );

  return router;
}
