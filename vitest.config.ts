import path from 'node:path';
import { defineConfig } from 'vitest/config';

const resolvePath = (relativePath: string) => path.resolve(__dirname, relativePath);

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    setupFiles: ['vitest.setup.ts'],
  },
  resolve: {
    alias: [
      { find: '#routes', replacement: resolvePath('src/adapters/express/routes') },
      { find: '#controllers', replacement: resolvePath('src/adapters/express/controllers') },
      { find: '#middlewares', replacement: resolvePath('src/adapters/express/middlewares') },
      { find: '#cookies', replacement: resolvePath('src/adapters/express/cookies') },
      { find: '#entities', replacement: resolvePath('src/domain/entities') },
      { find: '#repositories', replacement: resolvePath('src/domain/repositories') },
      { find: '#domain-services', replacement: resolvePath('src/domain/services') },
      { find: '#tests', replacement: resolvePath('src/tests') },
      { find: '#services', replacement: resolvePath('src/services') },
      { find: '#config', replacement: resolvePath('src/config') },
      { find: '#usecases', replacement: resolvePath('src/usecases') },
      { find: '#generated', replacement: resolvePath('generated') },
      { find: '#shared', replacement: resolvePath('src/shared') },
      { find: '#db', replacement: resolvePath('src/infra/db') },
    ],
  },
  esbuild: {
    target: 'node24',
  },
});
