import type { PatientEntity } from '#entities/patient.entity';

export interface GetAllPatientsResponseDTO {
  data: PatientEntity[];
  total: number;
  page: number;
  pageSize: number;
}
