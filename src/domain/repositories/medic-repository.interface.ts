import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';

export type MedicUniqueFilter = Partial<MedicEntityWithoutPassword>;

export abstract class MedicRepository {
  abstract findUnique<T extends boolean | undefined = false>(
    where: MedicUniqueFilter,
    withPassword?: T,
  ): Promise<T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword | undefined>;

  abstract create(
    dto: CreateMedicRequestDTO,
    hashedPassword: string,
  ): Promise<MedicEntityWithoutPassword>;
}
