import type { MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import type { CreateMedicRequestDTO } from '#usecases/medic/create-medic/create-medic.dto';
import type { CreateMedicUseCasePort } from '#usecases/medic/create-medic/create-medic.port';
import { hash } from '@node-rs/argon2';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateMedicUseCase implements CreateMedicUseCasePort {
  constructor(@inject('MedicRepository') private readonly medicRepository: MedicRepository) {}

  async execute(payload: CreateMedicRequestDTO): Promise<MedicEntityWithoutPassword> {
    const hashedPassword = await hash(payload.password, {
      parallelism: 2,
      memoryCost: 19456, // 19 MB
    });

    return await this.medicRepository.create(payload, hashedPassword);
  }
}
