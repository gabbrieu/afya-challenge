import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateMedicRequestDTO {
  @IsEmail()
  declare email: string;

  @MinLength(4)
  @IsString()
  declare password: string;
}
