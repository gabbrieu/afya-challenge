import type { TokenService } from '#domain-services/token-service.interface';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeMedicEntity } from '#tests/mocks/entities';
import type { MockedDependencies } from '#tests/types';
import { LoginUseCase } from '#usecases/auth/login/login.usecase';
import { verify } from '@node-rs/argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@node-rs/argon2', () => ({
  verify: vi.fn(),
}));

describe('LoginUseCase', () => {
  const medicRepository: MockedDependencies<MedicRepository> = {
    findUnique: vi.fn(),
    create: vi.fn(),
  };

  const tokenService: MockedDependencies<TokenService> = {
    signPair: vi.fn(),
    verifyAccess: vi.fn(),
    verifyRefresh: vi.fn(),
  };

  const verifyMock = vi.mocked(verify);
  const useCase = new LoginUseCase(medicRepository as unknown as MedicRepository, tokenService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve autenticar um médico com credenciais válidas', async () => {
    const medic = makeMedicEntity({ id: 42, email: 'medic@example.com', password: 'hashed' });
    medicRepository.findUnique.mockResolvedValue(medic);
    verifyMock.mockResolvedValue(true);
    const tokenPair = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessTtlMs: 1000,
      refreshTtlMs: 2000,
    };
    tokenService.signPair.mockResolvedValue(tokenPair);

    const result = await useCase.execute({ email: medic.email, password: 'plain-password' });

    expect(medicRepository.findUnique).toHaveBeenCalledWith({ email: medic.email }, true);
    expect(verifyMock).toHaveBeenCalledWith('hashed', 'plain-password');
    expect(tokenService.signPair).toHaveBeenCalledWith({
      sub: String(medic.id),
      email: medic.email,
    });
    expect(result).toStrictEqual(tokenPair);
  });

  it('deve lançar erro para médico inexistente', async () => {
    medicRepository.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute({ email: 'missing@example.com', password: '1234' });

    await expect(response).rejects.toMatchObject({
      message: 'Wrong credentials',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(verifyMock).not.toHaveBeenCalled();
    expect(tokenService.signPair).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a senha não confere', async () => {
    const medic = makeMedicEntity({ password: 'stored-hash' });
    medicRepository.findUnique.mockResolvedValue(medic);
    verifyMock.mockResolvedValue(false);

    const response = useCase.execute({ email: medic.email, password: 'wrong-password' });

    await expect(response).rejects.toMatchObject({
      message: 'Wrong credentials',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenService.signPair).not.toHaveBeenCalled();
  });
});
