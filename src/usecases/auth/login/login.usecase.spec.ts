import { HttpStatusCode } from '#shared/http-status-code.enum';
import { makeMedicEntity } from '#tests/mocks/entities';
import { medicRepositoryMock } from '#tests/mocks/repositories';
import { tokenServiceMock } from '#tests/mocks/services';
import { LoginUseCase } from '#usecases/auth/login/login.usecase';
import { verify } from '@node-rs/argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@node-rs/argon2', () => ({
  verify: vi.fn(),
}));

describe('LoginUseCase', () => {
  const verifyMock = vi.mocked(verify);
  const useCase = new LoginUseCase(medicRepositoryMock, tokenServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve autenticar um médico com credenciais válidas', async () => {
    const medic = makeMedicEntity({ id: 42, email: 'medic@example.com', password: 'hashed' });
    medicRepositoryMock.findUnique.mockResolvedValue(medic);
    verifyMock.mockResolvedValue(true);
    const tokenPair = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessTtlMs: 1000,
      refreshTtlMs: 2000,
    };
    tokenServiceMock.signPair.mockResolvedValue(tokenPair);

    const result = await useCase.execute({ email: medic.email, password: 'plain-password' });

    expect(medicRepositoryMock.findUnique).toHaveBeenCalledWith({ email: medic.email }, true);
    expect(verifyMock).toHaveBeenCalledWith('hashed', 'plain-password');
    expect(tokenServiceMock.signPair).toHaveBeenCalledWith({
      sub: String(medic.id),
      email: medic.email,
    });
    expect(result).toStrictEqual(tokenPair);
  });

  it('deve lançar erro para médico inexistente', async () => {
    medicRepositoryMock.findUnique.mockResolvedValue(undefined);

    const response = useCase.execute({ email: 'missing@example.com', password: '1234' });

    await expect(response).rejects.toMatchObject({
      message: 'Wrong credentials',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(verifyMock).not.toHaveBeenCalled();
    expect(tokenServiceMock.signPair).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a senha não confere', async () => {
    const medic = makeMedicEntity({ password: 'stored-hash' });
    medicRepositoryMock.findUnique.mockResolvedValue(medic);
    verifyMock.mockResolvedValue(false);

    const response = useCase.execute({ email: medic.email, password: 'wrong-password' });

    await expect(response).rejects.toMatchObject({
      message: 'Wrong credentials',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    });
    expect(tokenServiceMock.signPair).not.toHaveBeenCalled();
  });
});
