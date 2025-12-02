import type { NoteEntity } from '#entities/note.entity';
import type { CreateNoteUseCaseRequestDTO } from '#usecases/note/create/create-note.dto';
import type { UpdateNoteRequestDTO } from '#usecases/note/update/update-note.dto';

export abstract class NoteRepository {
  abstract create(medicId: number, dto: CreateNoteUseCaseRequestDTO): Promise<NoteEntity>;

  abstract findByAppointmentAndMedic(
    appointmentId: number,
    medicId: number,
  ): Promise<NoteEntity | undefined>;

  abstract update(
    appointmentId: number,
    medicId: number,
    dto: UpdateNoteRequestDTO,
  ): Promise<NoteEntity>;
}
