import type { LoginResponseDTO } from '#usecases/auth/login.dto';
import type { Response } from 'express';

export function setAuthCookies(res: Response, auth: LoginResponseDTO): void {
  const secure = process.env.NODE_ENV === 'production';

  res.cookie('access_token', auth.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000, // 5 minutos
    path: '/',
  });
  res.cookie('refresh_token', auth.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    path: '/auth/refresh',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
}
