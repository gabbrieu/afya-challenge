import type { PrismaClientType } from '#db/prisma/client';
import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { Medic, Prisma } from '#generated/prisma/client';
import type { MedicRepository, MedicUniqueFilter } from '#repositories/medic-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';
import type { Logger } from 'pino';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaMedicRepository implements MedicRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClientType,
    @inject('Logger') private readonly logger: Logger,
  ) {}

  async findUnique<T extends boolean | undefined = false>(
    where: MedicUniqueFilter,
    withPassword?: T,
  ): Promise<T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword | undefined> {
    try {
      const medic = await this.prisma.medic.findUnique({
        where: where as Prisma.MedicWhereUniqueInput,
      });

      if (!medic)
        return undefined as T extends true
          ? MedicEntity | undefined
          : MedicEntityWithoutPassword | undefined;

      return this.mapToDomain(medic, withPassword);
    } catch (error: any) {
      this.logger.error(error);
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
    const medic = await this.prisma.medic.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return this.mapToDomain(medic, false);
  }

  private mapToDomain<T extends boolean | undefined = false>(
    user: Medic,
    withPassword?: T,
  ): T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword {
    const userBase: MedicEntityWithoutPassword = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (withPassword) {
      return {
        ...userBase,
        password: user.password,
      } as T extends true ? MedicEntity : never;
    }

    return userBase as T extends true ? never : MedicEntityWithoutPassword;
  }
}
