import { PrismaMedicRepository } from '#db/prisma/medic.repository';
import type { DependencyContainer } from 'tsyringe';

export function setupRepositoriesContainers(container: DependencyContainer): void {
  container.register('MedicRepository', { useClass: PrismaMedicRepository });
}
