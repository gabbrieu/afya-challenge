import { CreateAppointmentUseCase } from '#usecases/appointment/create/create-appointment.usecase';
import { DeleteAppointmentUseCase } from '#usecases/appointment/delete/delete-appointment.usecase';
import { GetAppointmentsUseCase } from '#usecases/appointment/get-all/get-appointments.usecase';
import { UpdateAppointmentUseCase } from '#usecases/appointment/update/update-appointment.usecase';
import { CreateNoteUseCase } from '#usecases/note/create/create-note.usecase';
import { LoginUseCase } from '#usecases/auth/login/login.usecases';
import { RefreshTokenUseCase } from '#usecases/auth/refresh/refresh.usecase';
import { CreateMedicUseCase } from '#usecases/medic/create-medic/create-medic.usecase';
import { CreatePatientUseCase } from '#usecases/patient/create/create-patient.usecase';
import { GetAllPatientsUseCase } from '#usecases/patient/get-all/get-all-patients.usecase';
import { UpdatePatientUseCase } from '#usecases/patient/update/update-patient.usecase';
import type { DependencyContainer } from 'tsyringe';

export function setupUseCasesContainers(container: DependencyContainer): void {
  // Auth
  container.register('LoginUseCase', {
    useClass: LoginUseCase,
  });
  container.register('RefreshTokenUseCase', {
    useClass: RefreshTokenUseCase,
  });

  // Medic
  container.register('CreateMedicUseCase', { useClass: CreateMedicUseCase });

  // Patient
  container.register('CreatePatientUseCase', { useClass: CreatePatientUseCase });
  container.register('GetAllPatientsUseCase', { useClass: GetAllPatientsUseCase });
  container.register('UpdatePatientUseCase', { useClass: UpdatePatientUseCase });

  // Appointment
  container.register('CreateAppointmentUseCase', { useClass: CreateAppointmentUseCase });
  container.register('GetAppointmentsUseCase', { useClass: GetAppointmentsUseCase });
  container.register('UpdateAppointmentUseCase', { useClass: UpdateAppointmentUseCase });
  container.register('DeleteAppointmentUseCase', { useClass: DeleteAppointmentUseCase });
  container.register('CreateNoteUseCase', { useClass: CreateNoteUseCase });
}
