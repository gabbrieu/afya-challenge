import { LoginUseCase } from '#usecases/auth/login/login.usecases';
import { CreateMedicUseCase } from '#usecases/medic/create-medic/create-medic.usecase';
import type { DependencyContainer } from 'tsyringe';

export function setupUseCasesContainers(container: DependencyContainer): void {
  // Auth
  container.register('LoginUseCase', {
    useClass: LoginUseCase,
  });

  // Medic
  container.register('CreateMedicUseCase', { useClass: CreateMedicUseCase });
}
