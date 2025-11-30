import type { TokenPair, TokenService } from '#domain-services/token-service.interface';
import type { LoginResponseDTO } from '#usecases/auth/login/login.dto';

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const accessKey = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-access');
const refreshKey = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-refresh');

export class JwtTokenService implements TokenService {
  private accessTtl = '5m';
  private refreshTtl = '7d';

  async signPair(payload: JWTPayload): Promise<TokenPair> {
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.accessTtl)
      .sign(accessKey);

    const refreshToken = await new SignJWT({
      sub: payload.sub,
      email: payload.email as string,
      typ: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.refreshTtl)
      .sign(refreshKey);

    return {
      accessToken,
      refreshToken,
      accessTtlMs: 5 * 60 * 1000, // 5 minutos
      refreshTtlMs: 7 * 24 * 60 * 60 * 1000, // 7 dias
    } as LoginResponseDTO;
  }

  async verifyAccess(token: string): Promise<JWTPayload> {
    const r = await jwtVerify(token, accessKey, { algorithms: ['HS256'] });
    return r.payload;
  }

  async verifyRefresh(token: string): Promise<JWTPayload> {
    const r = await jwtVerify(token, refreshKey, { algorithms: ['HS256'] });
    return r.payload;
  }
}
