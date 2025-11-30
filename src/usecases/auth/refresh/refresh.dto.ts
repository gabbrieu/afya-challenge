import { IsString } from 'class-validator';

export class RefreshTokenRequestDTO {
  @IsString()
  declare refreshToken: string;
}
