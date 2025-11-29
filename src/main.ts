import { logger } from '#config/logger';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { createServer } from './server.js';

async function bootstrap() {
  container.registerInstance('Logger', logger);

  const app = createServer(container);
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port, () => {
    logger.info(`HTTP server running on: ${port}`);
  });

  const shutdown = (signal: string): void => {
    logger.info(`Received ${signal}, shutting down...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start');
  process.exit(1);
});
