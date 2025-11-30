import type { PatientRepository } from '#repositories/patient-repository.interface';
import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsUseCasePort } from '#usecases/patient/get-all/get-all-patients.port';
import type { GetAllPatientsResponseDTO } from '#usecases/patient/get-all/get-all-patients.response';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetAllPatientsUseCase implements GetAllPatientsUseCasePort {
  constructor(@inject('PatientRepository') private readonly patientRepository: PatientRepository) {}

  async execute(payload: GetAllPatientsRequestDTO): Promise<GetAllPatientsResponseDTO> {
    return await this.patientRepository.getAll(payload);
  }
}
