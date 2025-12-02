import type { NoteEntity } from '#entities/note.entity';
import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { NoteRepository } from '#repositories/note-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateNoteUseCaseRequestDTO } from '#usecases/note/create/create-note.dto';
import type { CreateNoteUseCasePort } from '#usecases/note/create/create-note.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateNoteUseCase implements CreateNoteUseCasePort {
  constructor(
    @inject('NoteRepository') private readonly noteRepository: NoteRepository,
    @inject('AppointmentRepository') private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(medicId: number, payload: CreateNoteUseCaseRequestDTO): Promise<NoteEntity> {
    const appointment = await this.appointmentRepository.findUnique({
      id: payload.appointmentId,
      medicId,
    });
    if (!appointment) {
      throw new AppError({
        message: 'Consulta não encontrada',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return await this.noteRepository.create(medicId, payload);
  }
}
