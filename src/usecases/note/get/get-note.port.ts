import type { NoteEntity } from '#entities/note.entity';

export interface GetNoteUseCasePort {
  execute(appointmentId: number, medicId: number): Promise<NoteEntity>;
}
