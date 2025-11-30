import type { MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';

export interface CreateMedicUseCasePort {
  execute(payload: CreateMedicRequestDTO): Promise<MedicEntityWithoutPassword>;
}
