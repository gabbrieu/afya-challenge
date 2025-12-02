import type { NoteEntity } from '#entities/note.entity';
import type { CreateNoteUseCaseRequestDTO } from '#usecases/note/create/create-note.dto';

export abstract class NoteRepository {
  abstract create(medicId: number, dto: CreateNoteUseCaseRequestDTO): Promise<NoteEntity>;
}
