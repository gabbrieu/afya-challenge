import { clearAuthCookies, setAuthCookies } from '#cookies/index';
import type { LoginRequestDTO } from '#usecases/auth/login.dto';
import type { LoginUseCasePort } from '#usecases/auth/login.port';
import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthController {
  constructor(@inject('LoginUseCasePort') private readonly loginUseCase: LoginUseCasePort) {}

  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body as LoginRequestDTO;
    const jwt = await this.loginUseCase.execute(dto);

    setAuthCookies(res, jwt);
    res.json(jwt);
  }

  async logout(res: Response): Promise<void> {
    clearAuthCookies(res);
  }
}
