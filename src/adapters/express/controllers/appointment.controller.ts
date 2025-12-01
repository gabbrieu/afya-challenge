import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateAppointmentRequestDTO } from '#usecases/appointment/create/create-appointment.dto';
import type { CreateAppointmentUseCasePort } from '#usecases/appointment/create/create-appointment.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AppointmentController {
  constructor(
    @inject('CreateAppointmentUseCase')
    private readonly createAppointmentUseCase: CreateAppointmentUseCasePort,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const medicId = Number(req.user.sub);
    if (Number.isNaN(medicId)) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const body: CreateAppointmentRequestDTO = req.body;
    const appointment = await this.createAppointmentUseCase.execute(medicId, body);

    res.status(HttpStatusCode.CREATED).json(appointment);
  }
}
