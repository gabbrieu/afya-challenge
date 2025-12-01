import { authGuard } from '#middlewares/auth-guard.middlewares';
import { registerAuthRoutes } from '#routes/auth.routes';
import { registerAppointmentRoutes } from '#routes/appointment.routes';
import { registerMedicRoutes } from '#routes/medic.routes';
import { registerPatientRoutes } from '#routes/patient.routes';
import type { Application } from 'express';
import type { DependencyContainer } from 'tsyringe';

export function registerRoutes(app: Application, container: DependencyContainer): void {
  app.use('/auth', registerAuthRoutes(container));
  app.use('/medics', registerMedicRoutes(container));
  app.use('/patients', authGuard(container), registerPatientRoutes(container));
  app.use('/appointments', authGuard(container), registerAppointmentRoutes(container));

  // --------- Me ----------
  app.get('/me', authGuard(container), (req, res) => {
    res.json(req.user);
  });
}
