import type { DateTime } from 'luxon';

export interface BaseEntity {
  id: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
