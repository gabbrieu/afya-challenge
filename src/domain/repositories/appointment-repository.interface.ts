import type { AppointmentEntity } from '#entities/appointment.entity';
import type { Prisma } from '#generated/prisma/client';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import type { GetAppointmentsRequestDTO } from '#usecases/appointment/get-all/get-appointments.dto';
import type { GetAppointmentsResponseDTO } from '#usecases/appointment/get-all/get-appointments.response';
import type { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';

export abstract class AppointmentRepository {
  abstract create(medicId: number, dto: CreateAppointmentRequestDTO): Promise<AppointmentEntity>;

  abstract hasOverlap(params: {
    medicId: number;
    startAt: Date;
    endAt: Date;
    ignoreAppointmentId?: number;
  }): Promise<boolean>;

  abstract listByMedic(
    medicId: number,
    dto: GetAppointmentsRequestDTO,
  ): Promise<GetAppointmentsResponseDTO>;

  abstract findUnique(
    where: Prisma.AppointmentWhereUniqueInput,
  ): Promise<AppointmentEntity | undefined>;

  abstract update(
    id: number,
    medicId: number,
    dto: UpdateAppointmentRequestDTO,
  ): Promise<AppointmentEntity>;

  abstract delete(id: number): Promise<void>;
}
