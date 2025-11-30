import type { TokenPair } from '#domain-services/token-service.interface';
import type { Response } from 'express';

export function setAuthCookies(res: Response, auth: TokenPair): void {
  const secure = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', auth.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: auth.accessTtlMs,
    path: '/',
  });
  res.cookie('refreshToken', auth.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: auth.refreshTtlMs,
    path: '/auth/refresh',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/auth/refresh' });
}
