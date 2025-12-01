import type { BaseEntity } from '#entities/base.entity';
import type { DateTime } from 'luxon';

export enum AppointmentStatusEnum {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface AppointmentEntity extends BaseEntity {
  medicId: number;
  patientId: number;
  startAt: DateTime;
  endAt: DateTime;
  status: AppointmentStatusEnum;
}
