import { IsNotEmpty } from 'class-validator';
// Data Transfer Object

export class CreateGenreDto {
  @IsNotEmpty()
  name: string;
}
