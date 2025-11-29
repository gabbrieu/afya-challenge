import type { JWTPayload } from 'jose';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTtlMs: number;
  refreshTtlMs: number;
};

export interface TokenService {
  signPair(payload: JWTPayload): Promise<TokenPair>;
  verifyAccess(token: string): Promise<JWTPayload>;
  verifyRefresh(token: string): Promise<JWTPayload>;
}
