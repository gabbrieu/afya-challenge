import { clearAuthCookies, setAuthCookies } from '#cookies/index';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { LoginRequestDTO } from '#usecases/auth/login/login.dto';
import type { LoginUseCasePort } from '#usecases/auth/login/login.port';
import type { RefreshTokenUseCasePort } from '#usecases/auth/refresh/refresh.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthController {
  constructor(
    @inject('LoginUseCase') private readonly loginUseCase: LoginUseCasePort,
    @inject('RefreshTokenUseCase') private readonly refreshTokenUseCase: RefreshTokenUseCasePort,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body as LoginRequestDTO;
    const jwt = await this.loginUseCase.execute(dto);

    setAuthCookies(res, jwt);
    res.json(jwt);
  }

  async logout(res: Response): Promise<void> {
    clearAuthCookies(res);
    res.sendStatus(HttpStatusCode.NO_CONTENT);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken: string = req.cookies.refreshToken;
    const tokenPair = await this.refreshTokenUseCase.execute({ refreshToken });

    setAuthCookies(res, tokenPair);
    res.json(tokenPair);
  }
}
