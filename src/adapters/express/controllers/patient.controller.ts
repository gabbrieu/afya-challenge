import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { CreatePatientUseCasePort } from '#usecases/patient/create/create-patient.port';
import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsUseCasePort } from '#usecases/patient/get-all/get-all-patients.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PatientController {
  constructor(
    @inject('CreatePatientUseCase')
    private readonly createPatientUseCase: CreatePatientUseCasePort,

    @inject('GetAllPatientsUseCase')
    private readonly getAllPatientsUseCase: GetAllPatientsUseCasePort,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const body: CreatePatientRequestDTO = req.body;
    const patient = await this.createPatientUseCase.execute(body);

    res.status(HttpStatusCode.CREATED).json(patient);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const query: GetAllPatientsRequestDTO = {
      includeDeleted: req.query.includeDeleted === 'true',
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    const patients = await this.getAllPatientsUseCase.execute(query);
    res.status(HttpStatusCode.OK).json(patients);
  }
}
