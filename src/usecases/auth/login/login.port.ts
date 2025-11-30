import type { LoginRequestDTO, LoginResponseDTO } from '#usecases/auth/login/login.dto';

export interface LoginUseCasePort {
  execute(body: LoginRequestDTO): Promise<LoginResponseDTO>;
}
