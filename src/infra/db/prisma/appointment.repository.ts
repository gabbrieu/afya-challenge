import type { Logger } from '#config/logger';
import type { PrismaClientType } from '#db/prisma/client';
import { AppointmentStatusEnum, type AppointmentEntity } from '#entities/appointment.entity';
import type { Appointment, Prisma } from '#generated/prisma/client';
import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClientType,
    @inject('Logger') private readonly logger: Logger,
  ) {}

  async create(medicId: number, dto: CreateAppointmentRequestDTO): Promise<AppointmentEntity> {
    try {
      const data: Prisma.AppointmentCreateInput = {
        medic: { connect: { id: medicId } },
        patient: { connect: { id: dto.patientId } },
        startAt: DateTime.fromISO(dto.startAt).toJSDate(),
        endAt: DateTime.fromISO(dto.endAt).toJSDate(),
      };

      const appointment = await this.prisma.appointment.create({ data });

      return this.mapToDomain(appointment);
    } catch (error: any) {
      this.logger.error(error, 'Erro na criação do repositório de Consultas');
      throw new AppError({
        message: error.message || 'Erro na criação do repositório de Consultas',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async hasOverlap(params: { medicId: number; startAt: Date; endAt: Date }): Promise<boolean> {
    const { medicId, startAt, endAt } = params;

    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        medicId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      select: { id: true },
    });

    return Boolean(overlapping);
  }

  private mapToDomain(appointment: Appointment): AppointmentEntity {
    return {
      id: appointment.id,
      medicId: appointment.medicId,
      patientId: appointment.patientId,
      startAt: DateTime.fromJSDate(appointment.startAt),
      endAt: DateTime.fromJSDate(appointment.endAt),
      status: AppointmentStatusEnum[appointment.status],
      createdAt: DateTime.fromJSDate(appointment.createdAt),
      updatedAt: DateTime.fromJSDate(appointment.updatedAt),
    };
  }
}
