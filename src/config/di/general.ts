import { logger } from '#config/logger';
import { prisma } from '#db/prisma/client';
import type { DependencyContainer } from 'tsyringe';

export function setupGeneralContainers(container: DependencyContainer): void {
  container.registerInstance('Logger', logger);
  container.registerInstance('PrismaClient', prisma);
}
