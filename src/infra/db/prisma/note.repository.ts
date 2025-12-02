import type { Logger } from '#config/logger';
import type { PrismaClientType } from '#db/prisma/client';
import type { NoteEntity } from '#entities/note.entity';
import type { Note } from '#generated/prisma/client';
import type { NoteRepository } from '#repositories/note-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateNoteUseCaseRequestDTO } from '#usecases/note/create/create-note.dto';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaNoteRepository implements NoteRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClientType,
    @inject('Logger') private readonly logger: Logger,
  ) {}

  async create(medicId: number, dto: CreateNoteUseCaseRequestDTO): Promise<NoteEntity> {
    try {
      const note = await this.prisma.note.create({
        data: {
          medic: { connect: { id: medicId } },
          appointment: { connect: { id: dto.appointmentId } },
          content: dto.content,
        },
      });

      return this.mapToDomain(note);
    } catch (error: any) {
      this.logger.error(error, 'Erro na criação de anotação');
      if (error.code === 'P2014') {
        throw new AppError({
          message: 'Já existe uma nota para essa consulta',
          statusCode: HttpStatusCode.CONFLICT,
        });
      }
      throw new AppError({
        message: error.message || 'Erro na criação de anotação',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private mapToDomain(note: Note): NoteEntity {
    return {
      id: note.id,
      appointmentId: note.appointmentId,
      medicId: note.medicId,
      content: note.content,
      createdAt: DateTime.fromJSDate(note.createdAt),
      updatedAt: DateTime.fromJSDate(note.updatedAt),
    };
  }
}
