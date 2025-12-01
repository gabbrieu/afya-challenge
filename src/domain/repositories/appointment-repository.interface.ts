import type { AppointmentEntity } from '#entities/appointment.entity';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';

export abstract class AppointmentRepository {
  abstract create(medicId: number, dto: CreateAppointmentRequestDTO): Promise<AppointmentEntity>;
  abstract hasOverlap(params: { medicId: number; startAt: Date; endAt: Date }): Promise<boolean>;
}
