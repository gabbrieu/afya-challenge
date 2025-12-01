import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateAppointmentRequestDTO {
  @IsInt()
  @Min(1)
  declare patientId: number;

  @IsDateString()
  declare startAt: string;

  @IsDateString()
  declare endAt: string;
}
