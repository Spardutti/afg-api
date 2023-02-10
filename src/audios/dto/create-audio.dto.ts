import { IsNotEmpty } from 'class-validator';

// Data Transfer Object
export class CreateAudioDto {
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // duration: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  isPremium: string;

  genres: string;

  // @IsNotEmpty()
  audioFile: Express.Multer.File;
}
