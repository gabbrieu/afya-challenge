import type { LoginRequestDTO, LoginResponseDTO } from '#usecases/auth/login.dto';
import type { LoginUseCasePort } from '#usecases/auth/login.port';
import { injectable } from 'tsyringe';

@injectable()
export class LoginUseCase implements LoginUseCasePort {
  async execute(body: LoginRequestDTO): Promise<LoginResponseDTO> {
    console.log(body);

    return {
      accessToken: '',
      refreshToken: '',
    };
  }
}
