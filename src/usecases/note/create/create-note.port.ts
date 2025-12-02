import type { NoteEntity } from '#entities/note.entity';
import type { CreateNoteUseCaseRequestDTO } from '#usecases/note/create/create-note.dto';

export interface CreateNoteUseCasePort {
  execute(medicId: number, payload: CreateNoteUseCaseRequestDTO): Promise<NoteEntity>;
}
