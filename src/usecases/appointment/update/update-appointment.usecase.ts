import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { UpdateAppointmentRequestDTO } from '#usecases/appointment/update/update-appointment.dto';
import type { UpdateAppointmentUseCasePort } from '#usecases/appointment/update/update-appointment.port';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateAppointmentUseCase implements UpdateAppointmentUseCasePort {
  constructor(
    @inject('AppointmentRepository') private readonly appointmentRepository: AppointmentRepository,
    @inject('PatientRepository') private readonly patientRepository: PatientRepository,
  ) {}

  async execute(appointmentId: number, medicId: number, payload: UpdateAppointmentRequestDTO) {
    const existing = await this.appointmentRepository.findUnique({
      id: appointmentId,
      medicId,
    });
    if (!existing) {
      throw new AppError({
        message: 'Consulta não encontrada',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    if (payload.patientId) {
      const patient = await this.patientRepository.findUnique({ id: payload.patientId });
      if (!patient) {
        throw new AppError({
          message: 'Paciente não encontrado',
          statusCode: HttpStatusCode.NOT_FOUND,
        });
      }
    }

    const newStart = payload.startAt ? DateTime.fromISO(payload.startAt) : null;
    const newEnd = payload.endAt ? DateTime.fromISO(payload.endAt) : null;

    if ((newStart && !newStart.isValid) || (newEnd && !newEnd.isValid)) {
      throw new AppError({
        message: 'Datas de agendamento inválidas',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const start = newStart ?? existing.startAt;
    const end = newEnd ?? existing.endAt;

    if (end <= start) {
      throw new AppError({
        message: 'A data/hora de término deve ser maior que a de início',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const hasConflict = await this.appointmentRepository.hasOverlap({
      medicId,
      startAt: start.toJSDate(),
      endAt: end.toJSDate(),
      ignoreAppointmentId: appointmentId,
    });

    if (hasConflict) {
      throw new AppError({
        message: 'Já existe consulta para este médico no intervalo informado',
        statusCode: HttpStatusCode.CONFLICT,
      });
    }

    return await this.appointmentRepository.update(appointmentId, medicId, {
      ...payload,
      startAt: newStart?.toISO(),
      endAt: newEnd?.toISO(),
    });
  }
}
