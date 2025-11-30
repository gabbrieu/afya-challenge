import type { BaseEntity } from '#entities/base.entity';
import type { DateTime } from 'luxon';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
  NOT_INFORM = 'NOT_INFORM',
}

export interface PatientEntity extends BaseEntity {
  name: string | null;
  cellphone: string | null;
  email: string | null;
  birthDate: DateTime | null;
  sex: GenderEnum | null;
  height: number | null;
  weight: number | null;
  deletedAt: DateTime | null;
}
