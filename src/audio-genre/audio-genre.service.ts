import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { AudioGenre } from './audio-genre.model';
import { AudioGenreDto } from './dto/audio-genre.dto';

@Injectable()
export class AudioGenreService {
  constructor(
    @InjectModel(AudioGenre)
    private audioGenre: typeof AudioGenre,
  ) {}

  async create(
    audioGenreDto: AudioGenreDto,
    transaction: Transaction,
  ): Promise<AudioGenre> {
    const { audioId, genreId } = audioGenreDto;
    return this.audioGenre.create({ audioId, genreId }, { transaction });
  }

  async findByGenre(genreId: number): Promise<AudioGenre[]> {
    return this.audioGenre.findAll({ where: { genreId } });
  }

  async findByAudio(
    audioId: number,
    transaction: Transaction,
  ): Promise<AudioGenre[]> {
    return this.audioGenre.findAll({ where: { audioId }, transaction });
  }

  async delete(
    genreId: number,
    audioId: number,
    transaction: Transaction,
  ): Promise<number> {
    return this.audioGenre.destroy({
      where: {
        genreId: genreId,
        audioId: audioId,
      },
      transaction,
    });
  }

  async findOne(
    audioId: number,
    genreId: number,
    transaction: Transaction,
  ): Promise<AudioGenre | null> {
    return this.audioGenre.findOne({
      where: {
        audioId,
        genreId,
      },
    });
    {
      transaction;
    }
  }
}
