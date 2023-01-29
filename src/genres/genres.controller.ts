import { CreateGenreDto } from './dto/create-genre.dto';
import { Controller, Get, Req, Post, Param, Body, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenreInterface } from './interfaces/genre.interfaces';

@Controller('genres')
export class GenresController {
  constructor(private genreService: GenresService) {}

  @Get()
  async findAll(): Promise<GenreInterface[]> {
    return this.genreService.findAll();
  }

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }
}
