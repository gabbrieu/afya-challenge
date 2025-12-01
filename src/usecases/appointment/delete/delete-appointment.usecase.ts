import type { AppointmentRepository } from '#repositories/appointment-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { DeleteAppointmentUseCasePort } from '#usecases/appointment/delete/delete-appointment.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteAppointmentUseCase implements DeleteAppointmentUseCasePort {
  constructor(
    @inject('AppointmentRepository') private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(appointmentId: number, medicId: number): Promise<void> {
    const existing = await this.appointmentRepository.findUnique({ id: appointmentId, medicId });
    if (!existing) {
      throw new AppError({
        message: 'Consulta não encontrada',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    await this.appointmentRepository.delete(appointmentId);
  }
}
