import { LoginUseCase } from '#usecases/auth/login.usecases';
import type { DependencyContainer } from 'tsyringe';

export function setupUseCasesContainers(container: DependencyContainer): void {
  container.register('LoginUseCasePort', {
    useClass: LoginUseCase,
  });
}
