import type { MedicEntity, MedicEntityWithoutPassword } from '#entities/medic.entity';

export type MedicUniqueFilter = Partial<MedicEntityWithoutPassword>;

export abstract class MedicRepository {
  abstract findUnique<T extends boolean | undefined = false>(
    where: MedicUniqueFilter,
    withPassword?: T,
  ): Promise<T extends true ? MedicEntity | undefined : MedicEntityWithoutPassword | undefined>;
}
