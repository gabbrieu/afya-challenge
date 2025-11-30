import { PrismaMedicRepository } from '#db/prisma/medic.repository';
import { PrismaPatientRepository } from '#db/prisma/patient.repository';
import type { DependencyContainer } from 'tsyringe';

export function setupRepositoriesContainers(container: DependencyContainer): void {
  container.register('MedicRepository', { useClass: PrismaMedicRepository });
  container.register('PatientRepository', { useClass: PrismaPatientRepository });
}
