import type { Mock } from 'vitest';

type AnyFn = (...args: any[]) => any;
export type MockedFn<T extends AnyFn> = T & Mock<AnyFn>;
export type MockedDependencies<T> = {
  [K in keyof T]: T[K] extends AnyFn ? MockedFn<T[K]> : T[K];
};
