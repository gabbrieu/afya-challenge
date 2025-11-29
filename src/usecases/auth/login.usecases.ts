import type { MedicRepository } from '#repositories/medic-repository.interface';
import type { JwtTokenService } from '#services/auth/jwt-token.service';
import { AppError } from '#shared/errors/app-error';
import { HttpStatusCode } from '#shared/http-status-code.enum';
import type { LoginRequestDTO, LoginResponseDTO } from '#usecases/auth/login.dto';
import type { LoginUseCasePort } from '#usecases/auth/login.port';
import { verify } from '@node-rs/argon2';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LoginUseCase implements LoginUseCasePort {
  constructor(
    @inject('MedicRepository') private readonly medicRepository: MedicRepository,
    @inject('JWTService') private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(payload: LoginRequestDTO): Promise<LoginResponseDTO> {
    const medic = await this.medicRepository.findUnique({ email: payload.email }, true);

    if (!medic) {
      throw new AppError({ message: 'Wrong credentials', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const passwordMatch = await verify(medic.password, payload.password);
    if (!passwordMatch) {
      throw new AppError({ message: 'Wrong credentials', statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    return await this.jwtTokenService.signPair({ sub: String(medic.id), email: medic.email });
  }
}
