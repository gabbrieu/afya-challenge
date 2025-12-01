import type { AppointmentEntity } from '#entities/appointment.entity';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';

export interface CreateAppointmentUseCasePort {
  execute(medicId: number, payload: CreateAppointmentRequestDTO): Promise<AppointmentEntity>;
}
