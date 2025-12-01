import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { GetAppointmentsRequestDTO } from '#usecases/appointment/get-all/get-appointments.dto';
import type { GetAppointmentsUseCasePort } from '#usecases/appointment/get-all/get-appointments.port';
import type { GetAppointmentsResponseDTO } from '#usecases/appointment/get-all/get-appointments.response';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetAppointmentsUseCase implements GetAppointmentsUseCasePort {
  constructor(
    @inject('AppointmentRepository') private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(
    medicId: number,
    payload: GetAppointmentsRequestDTO,
  ): Promise<GetAppointmentsResponseDTO> {
    const dateFrom = payload.dateFrom ? DateTime.fromISO(payload.dateFrom) : undefined;
    const dateTo = payload.dateTo ? DateTime.fromISO(payload.dateTo) : undefined;

    if ((dateFrom && !dateFrom.isValid) || (dateTo && !dateTo.isValid)) {
      throw new AppError({
        message: 'Datas dos filtros inválidas',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    return await this.appointmentRepository.listByMedic(medicId, {
      ...payload,
      dateFrom: dateFrom?.toISO(),
      dateTo: dateTo?.toISO(),
    });
  }
}
