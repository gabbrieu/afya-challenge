import type { BaseEntity } from './base.entity.js';

export interface MedicEntity extends BaseEntity {
  email: string;
  password: string;
}

export type MedicEntityWithoutPassword = Omit<MedicEntity, 'password'>;
