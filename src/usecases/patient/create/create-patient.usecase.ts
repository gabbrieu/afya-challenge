import type { PatientEntity } from '#entities/patient.entity';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { CreatePatientUseCasePort } from '#usecases/patient/create/create-patient.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreatePatientUseCase implements CreatePatientUseCasePort {
  constructor(@inject('PatientRepository') private readonly patientRepository: PatientRepository) {}

  async execute(payload: CreatePatientRequestDTO): Promise<PatientEntity> {
    return await this.patientRepository.create(payload);
  }
}
