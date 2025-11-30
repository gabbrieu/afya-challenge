import type { PatientEntity } from '#entities/patient.entity';
import type { Prisma } from '#generated/prisma/client';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';

export abstract class PatientRepository {
  abstract findUnique(where: Prisma.PatientWhereUniqueInput): Promise<PatientEntity | undefined>;
  abstract create(dto: CreatePatientRequestDTO): Promise<PatientEntity>;
}
