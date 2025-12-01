import { MedicController } from '#controllers/medic.controller';
import { AppointmentController } from '#controllers/appointment.controller';
import { PatientController } from '#controllers/patient.controller';
import type { DependencyContainer } from 'tsyringe';

export function setupControllersContainers(container: DependencyContainer): void {
  container.register('MedicController', {
    useClass: MedicController,
  });
  container.register('PatientController', {
    useClass: PatientController,
  });
  container.register('AppointmentController', {
    useClass: AppointmentController,
  });
}
