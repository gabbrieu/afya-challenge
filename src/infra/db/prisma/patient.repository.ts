import type { Logger } from '#config/logger';
import type { PrismaClientType } from '#db/prisma/client';
import { GenderEnum, type PatientEntity } from '#entities/patient.entity';
import type { Patient, Prisma } from '#generated/prisma/client';
import type { PatientRepository } from '#repositories/patient-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreatePatientRequestDTO } from '#usecases/patient/create/create-patient.dto';
import type { GetAllPatientsRequestDTO } from '#usecases/patient/get-all/get-all-patients.dto';
import type { GetAllPatientsResponseDTO } from '#usecases/patient/get-all/get-all-patients.response';
import type { UpdatePatientRequestDTO } from '#usecases/patient/update/update-patient.dto';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClientType,
    @inject('Logger') private readonly logger: Logger,
  ) {}

  async create(dto: CreatePatientRequestDTO): Promise<PatientEntity> {
    try {
      const data: Prisma.PatientCreateInput = {
        ...dto,
        birthDate: DateTime.fromISO(dto.birthDate).toJSDate(),
      };

      const patient = await this.prisma.patient.create({
        data,
      });

      return this.mapToDomain(patient);
    } catch (error: any) {
      this.logger.error(error, 'Erro na criação do repositório de Pacientes');
      throw new AppError({
        message: error.message || 'Erro na criação do repositório de Pacientes',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAll(dto: GetAllPatientsRequestDTO): Promise<GetAllPatientsResponseDTO> {
    try {
      const page = dto.page && dto.page > 0 ? dto.page : 1;
      const pageSize = dto.pageSize && dto.pageSize > 0 ? Math.min(dto.pageSize, 100) : 10;
      const where = dto?.includeDeleted ? undefined : { deletedAt: null };

      const [total, patients] = await this.prisma.$transaction([
        this.prisma.patient.count({ where }),
        this.prisma.patient.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      return {
        data: patients.map((patient) => this.mapToDomain(patient)),
        total,
        page,
        pageSize,
      };
    } catch (error: any) {
      this.logger.error(error, 'Erro na listagem de Pacientes');
      throw new AppError({
        message: error.message || 'Erro na listagem de Pacientes',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: number, dto: UpdatePatientRequestDTO): Promise<PatientEntity> {
    try {
      const data: Prisma.PatientUpdateInput = {};

      if (dto.name !== undefined) data.name = dto.name;
      if (dto.cellphone !== undefined) data.cellphone = dto.cellphone;
      if (dto.email !== undefined) data.email = dto.email;
      if (dto.sex !== undefined) data.sex = dto.sex;
      if (dto.height !== undefined) data.height = dto.height;
      if (dto.weight !== undefined) data.weight = dto.weight;
      if (dto.birthDate !== undefined) {
        data.birthDate = DateTime.fromISO(dto.birthDate).toJSDate();
      }

      const patient = await this.prisma.patient.update({
        where: { id },
        data,
      });

      return this.mapToDomain(patient);
    } catch (error: any) {
      this.logger.error(error, 'Erro na atualização do repositório de Pacientes');
      throw new AppError({
        message: error.message || 'Erro na atualização do repositório de Pacientes',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findUnique(where: Prisma.PatientWhereUniqueInput): Promise<PatientEntity | undefined> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where,
      });

      if (!patient) return undefined;

      return this.mapToDomain(patient);
    } catch (error: any) {
      this.logger.error(error, 'Erro na consulta do repositório de Pacientes');
      throw new AppError({
        message: error.message || 'Erro na consulta do repositório de Pacientes',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private mapToDomain(patient: Patient): PatientEntity {
    return {
      ...patient,
      sex: patient.sex ? GenderEnum[patient.sex] : null,
      birthDate: patient.birthDate ? DateTime.fromJSDate(patient.birthDate) : null,
      createdAt: DateTime.fromJSDate(patient.createdAt),
      updatedAt: DateTime.fromJSDate(patient.updatedAt),
      deletedAt: patient.deletedAt ? DateTime.fromJSDate(patient.deletedAt) : null,
    };
  }
}
