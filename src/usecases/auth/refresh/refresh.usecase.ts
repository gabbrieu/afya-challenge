import type { Logger } from '#config/logger';
import type { TokenPair, TokenService } from '#domain-services/token-service.interface';
import type { MedicEntityWithoutPassword } from '#entities/medic.entity';
import type { MedicRepository } from '#repositories/medic-repository.interface';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { RefreshTokenRequestDTO } from '#usecases/auth/refresh/refresh.dto';
import type { RefreshTokenUseCasePort } from '#usecases/auth/refresh/refresh.port';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RefreshTokenUseCase implements RefreshTokenUseCasePort {
  constructor(
    @inject('JWTService') private readonly jwtTokenService: TokenService,
    @inject('Logger') private readonly logger: Logger,
    @inject('MedicRepository') private readonly medicRepository: MedicRepository,
  ) {}

  async execute(payload: RefreshTokenRequestDTO): Promise<TokenPair> {
    try {
      const tokenPayload = await this.jwtTokenService.verifyRefresh(payload.refreshToken);

      if (tokenPayload.typ !== 'refresh') {
        throw new AppError({
          message: 'Token is not a refresh token',
          statusCode: HttpStatusCode.UNAUTHORIZED,
        });
      }

      const medic = await this.medicRepository.findUnique({ email: tokenPayload.email as string });

      if (!medic) {
        throw new AppError({ message: 'Medic not found', statusCode: HttpStatusCode.UNAUTHORIZED });
      }

      return await this.handleNewTokens(medic);
    } catch (error) {
      this.logger.error(error, 'Erro ao tentar atualizar o token de acesso');
      throw new AppError({ message: 'Unauthorized', statusCode: HttpStatusCode.UNAUTHORIZED });
    }
  }

  private async handleNewTokens(medic: MedicEntityWithoutPassword): Promise<TokenPair> {
    const tokenPair = await this.jwtTokenService.signPair({
      sub: String(medic.id),
      email: medic.email,
    });

    return tokenPair;
  }
}
