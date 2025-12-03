import type { TokenPair } from '#domain-services/token-service.interface';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeMedicEntityWithoutPassword } from '#tests/mocks/entities';
import { loggerMock } from '#tests/mocks/general';
import { medicRepositoryMock } from '#tests/mocks/repositories';
import { tokenServiceMock } from '#tests/mocks/services';
import { RefreshTokenUseCase } from '#usecases/auth/refresh/refresh.usecase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RefreshTokenUseCase', () => {
  const useCase = new RefreshTokenUseCase(tokenServiceMock, loggerMock, medicRepositoryMock);

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
    tokenServiceMock.verifyRefresh.mockResolvedValue({
      sub: String(medic.id),
      email: medic.email,
      typ: 'refresh',
    });
    medicRepositoryMock.findUnique.mockResolvedValue(medic);
    tokenServiceMock.signPair.mockResolvedValue(tokenPair);

    const result = await useCase.execute({ refreshToken: 'valid-refresh' });

    expect(tokenServiceMock.verifyRefresh).toHaveBeenCalledWith('valid-refresh');
    expect(medicRepositoryMock.findUnique).toHaveBeenCalledWith({ email: medic.email });
    expect(tokenServiceMock.signPair).toHaveBeenCalledWith({
      sub: String(medic.id),
      email: medic.email,
    });
    expect(result).toStrictEqual(tokenPair);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('deve lançar unauthorized quando o token não é do tipo refresh', async () => {
    tokenServiceMock.verifyRefresh.mockResolvedValue({ typ: 'access', email: 'medic@example.com' });

    const response = useCase.execute({ refreshToken: 'invalid-type' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenServiceMock.signPair).not.toHaveBeenCalled();
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
  });

  it('deve lançar unauthorized quando o médico não existe', async () => {
    tokenServiceMock.verifyRefresh.mockResolvedValue({
      typ: 'refresh',
      email: 'missing@example.com',
    });
    medicRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute({ refreshToken: 'valid-refresh' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenServiceMock.signPair).not.toHaveBeenCalled();
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
  });

  it('deve lançar unauthorized quando a verificação do token falha', async () => {
    tokenServiceMock.verifyRefresh.mockRejectedValue(new Error('bad token'));

    const response = useCase.execute({ refreshToken: 'broken' });

    await expect(response).rejects.toMatchObject({
      message: 'Unauthorized',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenServiceMock.signPair).not.toHaveBeenCalled();
    expect(medicRepositoryMock.findUnique).not.toHaveBeenCalled();
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
  });
});
