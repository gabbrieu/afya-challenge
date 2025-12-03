import type { TokenService } from '#domain-services/token-service.interface';
import type { MockedDependencies } from '#tests/types';
import { vi } from 'vitest';

export const tokenServiceMock: MockedDependencies<TokenService> = {
  signPair: vi.fn(),
  verifyAccess: vi.fn(),
  verifyRefresh: vi.fn(),
};
