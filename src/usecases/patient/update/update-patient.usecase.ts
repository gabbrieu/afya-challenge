import type { PatientEntity } from '#entities/patient.entity';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { UpdatePatientRequestDTO } from '#usecases/patient/update/update-patient.dto';
import type { UpdatePatientUseCasePort } from '#usecases/patient/update/update-patient.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdatePatientUseCase implements UpdatePatientUseCasePort {
  constructor(@inject('PatientRepository') private readonly patientRepository: PatientRepository) {}

  async execute(id: number, payload: UpdatePatientRequestDTO): Promise<PatientEntity> {
    const existing = await this.patientRepository.findUnique({ id });
    if (!existing) {
      throw new AppError({
        message: 'Paciente não encontrado',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return await this.patientRepository.update(id, payload);
  }
}
