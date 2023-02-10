import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Genre } from './genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private genresModel: typeof Genre,
  ) {}

  async create(genreDto: CreateGenreDto): Promise<Genre> {
    const { name } = genreDto;
    const genre = await this.genresModel.findOne({ where: { name } });
    if (genre) {
      throw new HttpException('This genre already exists', HttpStatus.CONFLICT);
    }
    return this.genresModel.create({ name });
  }

  findAll(): Promise<Genre[]> {
    return this.genresModel.findAll({
      order: [['name', 'ASC']],
      attributes: ['name', 'id'],
    });
  }
}
