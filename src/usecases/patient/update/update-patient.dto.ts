import { GenderEnum } from '#entities/patient.entity';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePatientRequestDTO {
  @IsOptional()
  @Length(3, 100)
  @IsString()
  declare name?: string;

  @IsOptional()
  @MaxLength(11)
  @IsString()
  declare cellphone?: string;

  @IsOptional()
  @MaxLength(80)
  @IsEmail()
  declare email?: string;

  @IsOptional()
  @IsDateString()
  declare birthDate?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  declare sex?: GenderEnum;

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @Max(350)
  @Min(0)
  declare height?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false })
  @Max(7000)
  @Min(0)
  declare weight?: number;
}
