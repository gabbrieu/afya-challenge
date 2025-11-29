import { setupGeneralContainers } from '#config/di/general';
import { setupRepositoriesContainers } from '#config/di/repositories';
import { setupServicesContainers } from '#config/di/services';
import { setupUseCasesContainers } from '#config/di/usecases';
import type { DependencyContainer } from 'tsyringe';

export function setupContainers(container: DependencyContainer): void {
  setupGeneralContainers(container);
  setupUseCasesContainers(container);
  setupServicesContainers(container);
  setupRepositoriesContainers(container);
}
