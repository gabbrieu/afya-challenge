import type { TokenPair, TokenService } from '#domain-services/token-service.interface';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeMedicEntityWithoutPassword } from '#tests/mocks/entities';
import { makeLoggerMock } from '#tests/mocks/general';
import type { MockedDependencies } from '#tests/types';
import { RefreshTokenUseCase } from '#usecases/auth/refresh/refresh.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RefreshTokenUseCase', () => {
  const logger = makeLoggerMock();

  const medicRepository: MockedDependencies<MedicRepository> = {
    findUnique: vi.fn(),
    create: vi.fn(),
  };

  const tokenService: MockedDependencies<TokenService> = {
    signPair: vi.fn(),
    verifyAccess: vi.fn(),
    verifyRefresh: vi.fn(),
  };
  const useCase = new RefreshTokenUseCase(tokenService, logger, medicRepository);

  const tokenPair: TokenPair = {
    accessToken: 'new-access',
    refreshToken: 'new-refresh',
    accessTtlMs: 1000,
    refreshTtlMs: 2000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar novos tokens quando o refresh token é válido', async () => {
    const medic = makeMedicEntityWithoutPassword({ id: 10, email: 'medic@example.com' });
    tokenService.verifyRefresh.mockResolvedValue({
      sub: String(medic.id),
      email: medic.email,
      typ: 'refresh',
    });
    medicRepository.findUnique.mockResolvedValue(medic);
    tokenService.signPair.mockResolvedValue(tokenPair);

    const result = await useCase.execute({ refreshToken: 'valid-refresh' });

    expect(tokenService.verifyRefresh).toHaveBeenCalledWith('valid-refresh');
    expect(medicRepository.findUnique).toHaveBeenCalledWith({ email: medic.email });
    expect(tokenService.signPair).toHaveBeenCalledWith({
      sub: String(medic.id),
      email: medic.email,
    });
    expect(result).toStrictEqual(tokenPair);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('deve lançar unauthorized quando o token não é do tipo refresh', async () => {
    tokenService.verifyRefresh.mockResolvedValue({ typ: 'access', email: 'medic@example.com' });

    const response = useCase.execute({ refreshToken: 'invalid-type' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenService.signPair).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('deve lançar unauthorized quando o médico não existe', async () => {
    tokenService.verifyRefresh.mockResolvedValue({ typ: 'refresh', email: 'missing@example.com' });
    medicRepository.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute({ refreshToken: 'valid-refresh' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenService.signPair).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('deve lançar unauthorized quando a verificação do token falha', async () => {
    tokenService.verifyRefresh.mockRejectedValue(new Error('bad token'));

    const response = useCase.execute({ refreshToken: 'broken' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenService.signPair).not.toHaveBeenCalled();
    expect(medicRepository.findUnique).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
