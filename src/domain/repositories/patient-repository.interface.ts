import type { PatientEntity } from '#entities/patient.entity';
import type { Prisma } from '#generated/prisma/client';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsResponseDTO } from '#usecases/patient/get-all/get-all-patients.response';
import type { UpdatePatientRequestDTO } from '#usecases/patient/update/update-patient.dto';

export abstract class PatientRepository {
  abstract findUnique(where: Prisma.PatientWhereUniqueInput): Promise<PatientEntity | undefined>;
  abstract create(dto: CreatePatientRequestDTO): Promise<PatientEntity>;
  abstract getAll(dto: GetAllPatientsRequestDTO): Promise<GetAllPatientsResponseDTO>;
  abstract update(id: number, dto: UpdatePatientRequestDTO): Promise<PatientEntity>;
  abstract anonymize(id: number): Promise<PatientEntity>;
}
