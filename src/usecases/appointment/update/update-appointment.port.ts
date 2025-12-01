import type { AppointmentEntity } from '#entities/appointment.entity';
import type { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';

export interface UpdateAppointmentUseCasePort {
  execute(
    id: number,
    medicId: number,
    payload: UpdateAppointmentRequestDTO,
  ): Promise<AppointmentEntity>;
}
