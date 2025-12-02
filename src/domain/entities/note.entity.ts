import type { BaseEntity } from '#entities/base.entity';

export interface NoteEntity extends BaseEntity {
  appointmentId: number;
  medicId: number;
  content: string;
}
