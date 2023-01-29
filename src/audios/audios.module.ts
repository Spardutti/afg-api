import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { AudiosController } from './audios.controller';
import { AudiosService } from './audios.service';
import { Audio } from './audios.model';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AudioGenreModule } from '../audio-genre/audio-genre.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Audio]),
    CloudinaryModule,
    AudioGenreModule,
  ],
  controllers: [AudiosController],
  providers: [AudiosService],
})
export class AudiosModule {}
