import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AudioGenre } from './audio-genre.model';
import { AudioGenreDto } from './dto/audio-genre.dto';

@Injectable()
export class AudioGenreService {
  constructor(
    @InjectModel(AudioGenre)
    private audioGenre: typeof AudioGenre,
  ) {}

  async create(audioGenreDto: AudioGenreDto): Promise<AudioGenre> {
    const { audioId, genreId } = audioGenreDto;
    return this.audioGenre.create({ audioId, genreId });
  }

  async findByGenre(genreId: number): Promise<AudioGenre[]> {
    return this.audioGenre.findAll({ where: { genreId } });
  }
}
