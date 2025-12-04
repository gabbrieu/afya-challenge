import { GenderEnum } from '#entities/patient.entity';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePatientRequestDTO {
  @Length(3, 100)
  @IsString()
  declare name: string;

  @MaxLength(11)
  @IsString()
  declare cellphone: string;

  @MaxLength(80)
  @IsEmail()
  declare email: string;

  @IsDateString()
  declare birthDate: string;

  @IsEnum(GenderEnum)
  declare sex: GenderEnum;

  @IsNumber({ allowNaN: false })
  @Max(99.99)
  @Min(0)
  declare height: number;

  @IsNumber({ allowNaN: false })
  @Max(999.99)
  @Min(0)
  declare weight: number;
}
