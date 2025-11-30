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
}
