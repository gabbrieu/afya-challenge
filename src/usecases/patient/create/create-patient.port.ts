import type { PatientEntity } from '#entities/patient.entity';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';

export interface CreatePatientUseCasePort {
  execute(payload: CreatePatientRequestDTO): Promise<PatientEntity>;
}
