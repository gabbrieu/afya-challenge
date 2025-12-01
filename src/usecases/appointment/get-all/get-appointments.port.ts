import type { GetAppointmentsRequestDTO } from '#usecases/appointment/get-all/get-appointments.dto';
import type { GetAppointmentsResponseDTO } from '#usecases/appointment/get-all/get-appointments.response';

export interface GetAppointmentsUseCasePort {
  execute(medicId: number, payload: GetAppointmentsRequestDTO): Promise<GetAppointmentsResponseDTO>;
}
