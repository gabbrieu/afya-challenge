import type { Logger } from '#config/logger';
import type { PrismaClientType } from '#db/prisma/client';
import { AppointmentStatusEnum, type AppointmentEntity } from '#entities/appointment.entity';
import type { Appointment, Prisma } from '#generated/prisma/client';
import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import type { GetAppointmentsRequestDTO } from '#usecases/appointment/get-all/get-appointments.dto';
import type { GetAppointmentsResponseDTO } from '#usecases/appointment/get-all/get-appointments.response';
import type { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';
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

  async hasOverlap(params: {
    medicId: number;
    startAt: Date;
    endAt: Date;
    ignoreAppointmentId?: number;
  }): Promise<boolean> {
    const { medicId, startAt, endAt, ignoreAppointmentId } = params;

    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        medicId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
        id: ignoreAppointmentId ? { not: ignoreAppointmentId } : undefined,
      },
      select: { id: true },
    });

    return Boolean(overlapping);
  }

  async listByMedic(
    medicId: number,
    dto: GetAppointmentsRequestDTO,
  ): Promise<GetAppointmentsResponseDTO> {
    try {
      const page = dto.page && dto.page > 0 ? dto.page : 1;
      const pageSize = dto.pageSize && dto.pageSize > 0 ? Math.min(dto.pageSize, 100) : 10;

      const dateFrom = dto.dateFrom ? DateTime.fromISO(dto.dateFrom).toJSDate() : undefined;
      const dateTo = dto.dateTo ? DateTime.fromISO(dto.dateTo).toJSDate() : undefined;

      const where: Prisma.AppointmentWhereInput = {
        medicId,
        startAt: dateFrom ? { gte: dateFrom } : undefined,
        endAt: dateTo ? { lte: dateTo } : undefined,
      };

      const [total, appointments] = await this.prisma.$transaction([
        this.prisma.appointment.count({ where }),
        this.prisma.appointment.findMany({
          where,
          orderBy: { startAt: 'asc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      return {
        data: appointments.map((appt) => this.mapToDomain(appt)),
        total,
        page,
        pageSize,
      };
    } catch (error: any) {
      this.logger.error(error, 'Erro na listagem de Consultas');
      throw new AppError({
        message: error.message || 'Erro na listagem de Consultas',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findUnique(
    where: Prisma.AppointmentWhereUniqueInput,
  ): Promise<AppointmentEntity | undefined> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where,
      });

      return appointment ? this.mapToDomain(appointment) : undefined;
    } catch (error: any) {
      this.logger.error(error, 'Erro na consulta do repositório de Consultas');
      throw new AppError({
        message: error.message || 'Erro na consulta do repositório de Consultas',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(
    id: number,
    medicId: number,
    dto: UpdateAppointmentRequestDTO,
  ): Promise<AppointmentEntity> {
    try {
      const data: Prisma.AppointmentUpdateInput = {};

      if (dto.patientId !== undefined) data.patient = { connect: { id: dto.patientId } };
      if (dto.startAt !== undefined) data.startAt = DateTime.fromISO(dto.startAt).toJSDate();
      if (dto.endAt !== undefined) data.endAt = DateTime.fromISO(dto.endAt).toJSDate();
      if (dto.status !== undefined) data.status = dto.status;

      const appointment = await this.prisma.appointment.update({
        where: { id, medicId },
        data,
      });

      return this.mapToDomain(appointment);
    } catch (error: any) {
      this.logger.error(error, 'Erro na atualização do repositório de Consultas');
      throw new AppError({
        message: error.message || 'Erro na atualização do repositório de Consultas',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.appointment.delete({ where: { id } });
    } catch (error: any) {
      this.logger.error(error, 'Erro na exclusão do repositório de Consultas');
      if (error instanceof AppError) throw error;
      throw new AppError({
        message: error.message || 'Erro na exclusão do repositório de Consultas',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
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
