import type { NoteEntity } from '#entities/note.entity';
import type { NoteRepository } from '#repositories/note-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { GetNoteUseCasePort } from '#usecases/note/get/get-note.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetNoteUseCase implements GetNoteUseCasePort {
  constructor(@inject('NoteRepository') private readonly noteRepository: NoteRepository) {}

  async execute(appointmentId: number, medicId: number): Promise<NoteEntity> {
    const note = await this.noteRepository.findUnique({ appointmentId, medicId });
    if (!note) {
      throw new AppError({ message: 'Nota não encontrada', statusCode: HttpStatusCode.NOT_FOUND });
    }
    return note;
  }
}
