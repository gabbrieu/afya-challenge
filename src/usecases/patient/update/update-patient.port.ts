import type { PatientEntity } from '#entities/patient.entity';
import type { UpdatePatientRequestDTO } from '#usecases/patient/update/update-patient.dto';

export interface UpdatePatientUseCasePort {
  execute(id: number, payload: UpdatePatientRequestDTO): Promise<PatientEntity>;
}
