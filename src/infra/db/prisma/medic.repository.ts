import type { Logger } from '#config/logger';
import type { PrismaClientType } from '#db/prisma/client';
import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { Medic, Prisma } from '#generated/prisma/client';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';
import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaMedicRepository implements MedicRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClientType,
    @inject('Logger') private readonly logger: Logger,
  ) {}

  async findUnique<T extends boolean | undefined = false>(
    where: Prisma.MedicWhereUniqueInput,
    withPassword?: T,
  ): Promise<T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword | undefined> {
    try {
      const medic = await this.prisma.medic.findUnique({
        where,
      });

      if (!medic)
        return undefined as T extends true
          ? MedicEntity | undefined
          : MedicEntityWithoutPassword | undefined;

      return this.mapToDomain(medic, withPassword);
    } catch (error: any) {
      this.logger.error(error, 'Erro na consulta do repositório de Médicos');
      throw new AppError({
        message: error.message || 'Erro na consulta do repositório de Médicos',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(
    dto: CreateMedicRequestDTO,
    hashedPassword: string,
  ): Promise<MedicEntityWithoutPassword> {
    try {
      const medic = await this.prisma.medic.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return this.mapToDomain(medic, false);
    } catch (error: any) {
      this.logger.error(error, 'Erro na criação do repositório de Médicos');
      throw new AppError({
        message: error.message || 'Erro na criação do repositório de Médicos',
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private mapToDomain<T extends boolean | undefined = false>(
    medic: Medic,
    withPassword?: T,
  ): T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword {
    const medicBase: MedicEntityWithoutPassword = {
      id: medic.id,
      email: medic.email,
      createdAt: DateTime.fromJSDate(medic.createdAt),
      updatedAt: DateTime.fromJSDate(medic.updatedAt),
    };

    if (withPassword) {
      return {
        ...medicBase,
        password: medic.password,
      } as T extends true ? MedicEntity : never;
    }

    return medicBase as T extends true ? never : MedicEntityWithoutPassword;
  }
}
