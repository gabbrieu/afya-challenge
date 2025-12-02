import type { PatientEntity } from '#entities/patient.entity';

export interface AnonymizePatientUseCasePort {
  execute(id: number): Promise<PatientEntity>;
}
