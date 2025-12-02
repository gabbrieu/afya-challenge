import type { NoteEntity } from '#entities/note.entity';
import type { UpdateNoteRequestDTO } from '#usecases/note/update/update-note.dto';

export interface UpdateNoteUseCasePort {
  execute(
    appointmentId: number,
    medicId: number,
    payload: UpdateNoteRequestDTO,
  ): Promise<NoteEntity>;
}
