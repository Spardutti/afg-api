import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AudioGenreService } from './audio-genre.service';
import { AudioGenre } from './audio-genre.model';

@Module({
  imports: [SequelizeModule.forFeature([AudioGenre])],
  providers: [AudioGenreService],
  exports: [AudioGenreService],
})
export class AudioGenreModule {}
