import { AppointmentStatusEnum } from '#entities/appointment.entity';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateAppointmentRequestDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  declare patientId?: number;

  @IsOptional()
  @IsDateString()
  declare startAt?: string;

  @IsOptional()
  @IsDateString()
  declare endAt?: string;

  @IsOptional()
  @IsEnum(AppointmentStatusEnum)
  declare status?: AppointmentStatusEnum;
}
