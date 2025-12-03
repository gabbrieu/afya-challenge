import type { MedicRepository } from '#repositories/medic-repository.interface';
import { makeMedicEntityWithoutPassword } from '#tests/mocks/entities';
import type { MockedDependencies } from '#tests/types';
import { CreateMedicUseCase } from '#usecases/medic/create-medic/create-medic.usecase';
import { hash } from '@node-rs/argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@node-rs/argon2', () => ({
  hash: vi.fn(),
}));

describe('CreateMedicUseCase', () => {
  const medicRepository: MockedDependencies<MedicRepository> = {
    findUnique: vi.fn(),
    create: vi.fn(),
  };

  const hashMock = vi.mocked(hash);
  const useCase = new CreateMedicUseCase(medicRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar um médico com senha hasheada', async () => {
    const payload = { email: 'medic@example.com', password: 'plain-secret' };
    const hashedPassword = 'hashed-secret';
    const createdMedic = makeMedicEntityWithoutPassword({ email: payload.email });

    hashMock.mockResolvedValue(hashedPassword);
    medicRepository.create.mockResolvedValue(createdMedic);

    const result = await useCase.execute(payload);

    expect(hashMock).toHaveBeenCalledWith(payload.password, {
      parallelism: 2,
      memoryCost: 19456,
    });
    expect(medicRepository.create).toHaveBeenCalledWith(payload, hashedPassword);
    expect(result).toStrictEqual(createdMedic);
  });

  it('deve propagar erro se o hash falhar', async () => {
    const payload = { email: 'medic@example.com', password: 'plain-secret' };
    hashMock.mockRejectedValue(new Error('hash failed'));

    await expect(useCase.execute(payload)).rejects.toThrow('hash failed');
    expect(medicRepository.create).not.toHaveBeenCalled();
  });

  it('deve propagar erro se o repositório falhar', async () => {
    const payload = { email: 'medic@example.com', password: 'plain-secret' };
    hashMock.mockResolvedValue('hashed-secret');
    medicRepository.create.mockRejectedValue(new Error('db error'));

    await expect(useCase.execute(payload)).rejects.toThrow('db error');
    expect(medicRepository.create).toHaveBeenCalledWith(payload, 'hashed-secret');
  });
});
