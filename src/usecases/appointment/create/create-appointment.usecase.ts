import type { AppointmentEntity } from '#entities/appointment.entity';
import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import type { CreateAppointmentUseCasePort } from '#usecases/appointment/create/create-appointment.port';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateAppointmentUseCase implements CreateAppointmentUseCasePort {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: AppointmentRepository,

    @inject('PatientRepository')
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(medicId: number, payload: CreateAppointmentRequestDTO): Promise<AppointmentEntity> {
    const patient = await this.patientRepository.findUnique({ id: payload.patientId });
    if (!patient) {
      throw new AppError({
        message: 'Paciente não encontrado',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    const start = DateTime.fromISO(payload.startAt);
    const end = DateTime.fromISO(payload.endAt);

    if (!start.isValid || !end.isValid) {
      throw new AppError({
        message: 'Datas de agendamento inválidas',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    if (end <= start) {
      throw new AppError({
        message: 'A data/hora de término deve ser maior que a de início',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const isStartDateOnPass = start.diffNow('days').days < 0;
    if (isStartDateOnPass) {
      throw new AppError({
        message: 'Não dá para agendar consultas no passado',
        statusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const hasConflict = await this.appointmentRepository.hasOverlap({
      medicId,
      startAt: start.toJSDate(),
      endAt: end.toJSDate(),
    });

    if (hasConflict) {
      throw new AppError({
        message: 'Já existe consulta para este médico no intervalo informado',
        statusCode: HttpStatusCode.CONFLICT,
      });
    }

    return await this.appointmentRepository.create(medicId, payload);
  }
}
