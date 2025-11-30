import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';
import type { CreateMedicUseCasePort } from '#usecases/medic/create-medic/create-medic.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class MedicController {
  constructor(
    @inject('CreateMedicUseCase') private readonly createMedicUseCase: CreateMedicUseCasePort,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateMedicRequestDTO;
    const medic = await this.createMedicUseCase.execute(body);

    res.status(HttpStatusCode.CREATED).json(medic);
  }
}
