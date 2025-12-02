import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { AnonymizePatientUseCasePort } from '#usecases/patient/anonymize/anonymize-patient.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AnonymizePatientUseCase implements AnonymizePatientUseCasePort {
  constructor(@inject('PatientRepository') private readonly patientRepository: PatientRepository) {}

  async execute(id: number) {
    const existing = await this.patientRepository.findUnique({ id });
    if (!existing) {
      throw new AppError({
        message: 'Paciente não encontrado',
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return await this.patientRepository.anonymize(id);
  }
}
