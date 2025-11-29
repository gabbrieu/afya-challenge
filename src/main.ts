import 'reflect-metadata';

import { setupContainers } from '#config/di/index';
import { logger } from '#config/logger';
import { prisma } from '#db/prisma/client';
import { container } from 'tsyringe';
import { createServer } from './server.js';

async function bootstrap() {
  setupContainers(container);

  const app = createServer(container);
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port, () => {
    logger.info(`HTTP server running on: ${port}`);
  });

  const shutdown = (signal: string): void => {
    logger.info(`Received ${signal}, shutting down...`);

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(async (err) => {
  logger.error({ err }, 'Failed to start');
  await prisma.$disconnect();
  process.exit(1);
});
