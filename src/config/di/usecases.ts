import { CreateAppointmentUseCase } from '#usecases/appointment/create/create-appointment.usecase';
import { DeleteAppointmentUseCase } from '#usecases/appointment/delete/delete-appointment.usecase';
import { GetAppointmentsUseCase } from '#usecases/appointment/get-all/get-appointments.usecase';
import { UpdateAppointmentUseCase } from '#usecases/appointment/update/update-appointment.usecase';
import { LoginUseCase } from '#usecases/auth/login/login.usecase';
import { RefreshTokenUseCase } from '#usecases/auth/refresh/refresh.usecase';
import { CreateMedicUseCase } from '#usecases/medic/create-medic/create-medic.usecase';
import { CreateNoteUseCase } from '#usecases/note/create/create-note.usecase';
import { GetNoteUseCase } from '#usecases/note/get/get-note.usecase';
import { UpdateNoteUseCase } from '#usecases/note/update/update-note.usecase';
import { AnonymizePatientUseCase } from '#usecases/patient/anonymize/anonymize-patient.usecase';
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
  container.register('AnonymizePatientUseCase', { useClass: AnonymizePatientUseCase });
  container.register('CreatePatientUseCase', { useClass: CreatePatientUseCase });
  container.register('GetAllPatientsUseCase', { useClass: GetAllPatientsUseCase });
  container.register('UpdatePatientUseCase', { useClass: UpdatePatientUseCase });

  // Appointment
  container.register('CreateAppointmentUseCase', { useClass: CreateAppointmentUseCase });
  container.register('CreateNoteUseCase', { useClass: CreateNoteUseCase });
  container.register('DeleteAppointmentUseCase', { useClass: DeleteAppointmentUseCase });
  container.register('GetAppointmentsUseCase', { useClass: GetAppointmentsUseCase });
  container.register('GetNoteUseCase', { useClass: GetNoteUseCase });
  container.register('UpdateAppointmentUseCase', { useClass: UpdateAppointmentUseCase });
  container.register('UpdateNoteUseCase', { useClass: UpdateNoteUseCase });
}
