import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { AnonymizePatientUseCasePort } from '#usecases/patient/anonymize/anonymize-patient.port';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { CreatePatientUseCasePort } from '#usecases/patient/create/create-patient.port';
import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsUseCasePort } from '#usecases/patient/get-all/get-all-patients.port';
import type { UpdatePatientRequestDTO } from '#usecases/patient/update/update-patient.dto';
import type { UpdatePatientUseCasePort } from '#usecases/patient/update/update-patient.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PatientController {
  constructor(
    @inject('CreatePatientUseCase')
    private readonly createPatientUseCase: CreatePatientUseCasePort,

    @inject('GetAllPatientsUseCase')
    private readonly getAllPatientsUseCase: GetAllPatientsUseCasePort,

    @inject('UpdatePatientUseCase')
    private readonly updatePatientUseCase: UpdatePatientUseCasePort,

    @inject('AnonymizePatientUseCase')
    private readonly anonymizePatientUseCase: AnonymizePatientUseCasePort,
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

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Id inválido' });
      return;
    }

    const body: UpdatePatientRequestDTO = req.body;
    const patient = await this.updatePatientUseCase.execute(id, body);

    res.status(HttpStatusCode.OK).json(patient);
  }

  async anonymize(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Id inválido' });
      return;
    }

    const patient = await this.anonymizePatientUseCase.execute(id);
    res.status(HttpStatusCode.OK).json(patient);
  }
}
