import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { CreatePatientUseCasePort } from '#usecases/patient/create/create-patient.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PatientController {
  constructor(
    @inject('CreatePatientUseCase') private readonly createPatientUseCase: CreatePatientUseCasePort,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const body: CreatePatientRequestDTO = req.body;
    const patient = await this.createPatientUseCase.execute(body);

    res.status(HttpStatusCode.CREATED).json(patient);
  }
}
