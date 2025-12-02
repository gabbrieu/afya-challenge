import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateNoteRequestDTO {
  @IsString()
  @MaxLength(1000)
  declare content: string;
}

export class CreateNoteUseCaseRequestDTO extends CreateNoteRequestDTO {
  @IsInt()
  @Min(1)
  declare appointmentId: number;
}
