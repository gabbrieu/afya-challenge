import type { LoginRequestDTO, LoginResponseDTO } from '#usecases/auth/login.dto';

export interface LoginUseCasePort {
  execute(body: LoginRequestDTO): Promise<LoginResponseDTO>;
}
