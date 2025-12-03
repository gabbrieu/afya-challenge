import type { Logger } from '#config/logger';
import { vi } from 'vitest';

export const loggerMock = {
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
} as unknown as Logger;
