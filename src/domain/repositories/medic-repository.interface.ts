import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { Prisma } from '#generated/prisma/client';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';

export abstract class MedicRepository {
  abstract findUnique<T extends boolean | undefined = false>(
    where: Prisma.MedicWhereUniqueInput,
    withPassword?: T,
  ): Promise<T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword | undefined>;

  abstract create(
    dto: CreateMedicRequestDTO,
    hashedPassword: string,
  ): Promise<MedicEntityWithoutPassword>;
}
