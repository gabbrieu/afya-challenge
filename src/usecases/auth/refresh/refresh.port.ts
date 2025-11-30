import type { TokenPair } from '#domain-services/token-service.interface';
import type { RefreshTokenRequestDTO } from '#usecases/auth/refresh/refresh.dto';

export interface RefreshTokenUseCasePort {
  execute(payload: RefreshTokenRequestDTO): Promise<TokenPair>;
}
