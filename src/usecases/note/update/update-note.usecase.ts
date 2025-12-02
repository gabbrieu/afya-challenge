import type { NoteEntity } from '#entities/note.entity';
import type { NoteRepository } from '#repositories/note-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { UpdateNoteRequestDTO } from '#usecases/note/update/update-note.dto';
import type { UpdateNoteUseCasePort } from '#usecases/note/update/update-note.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateNoteUseCase implements UpdateNoteUseCasePort {
  constructor(@inject('NoteRepository') private readonly noteRepository: NoteRepository) {}

  async execute(
    appointmentId: number,
    medicId: number,
    payload: UpdateNoteRequestDTO,
  ): Promise<NoteEntity> {
    const existing = await this.noteRepository.findByAppointmentAndMedic(appointmentId, medicId);
    if (!existing) {
      throw new AppError({ message: 'Nota não encontrada', statusCode: HttpStatusCode.NOT_FOUND });
    }

    return await this.noteRepository.update(appointmentId, medicId, payload);
  }
}
