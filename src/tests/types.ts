import type { vi } from 'vitest';

export type MockedFn<T extends (...args: any[]) => any> = ReturnType<typeof vi.fn<T>>;
export type MockedDependencies<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? MockedFn<T[K]> : T[K];
};
