import type { AppointmentEntity } from '#entities/appointment.entity';

export interface GetAppointmentsResponseDTO {
  data: AppointmentEntity[];
  total: number;
  page: number;
  pageSize: number;
}
