import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
  @IsEmail()
  declare email: string;

  @MinLength(4)
  @IsString()
  declare password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  accessTtlMs: number;
  refreshTtlMs: number;
}
