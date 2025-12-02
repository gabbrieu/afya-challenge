import { IsString, MaxLength } from 'class-validator';

export class UpdateNoteRequestDTO {
  @IsString()
  @MaxLength(1000)
  declare content: string;
}
