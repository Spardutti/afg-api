import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AudioGenre } from 'src/audio-genre/audio-genre.model';
import { AudioGenreService } from 'src/audio-genre/audio-genre.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Audio } from './audios.model';
import { CreateAudioDto } from './dto/create-audio.dto';

@Injectable()
export class AudiosService {
  constructor(
    @InjectModel(Audio)
    private audioModel: typeof Audio,
    private audioGenreService: AudioGenreService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<Audio[]> {
    return this.audioModel.findAll();
  }

  async findByPk(id: number): Promise<Audio> {
    const audio = await this.audioModel.findByPk(id);
    if (!audio)
      throw new HttpException('Audio not found', HttpStatus.NOT_FOUND);
    return audio;
  }

  async remove(id: number): Promise<Audio | String> {
    const audio = await this.audioModel.findOne({ where: { id } });
    if (audio) {
      await audio?.destroy();
      return audio!;
    }
    throw new HttpException('Audio not found', HttpStatus.NOT_FOUND);
  }

  async create(
    audioDto: CreateAudioDto,
    file: Express.Multer.File,
  ): Promise<Audio> {
    const { name, description, duration } = audioDto;
    const genres = JSON.parse(audioDto.genres);
    const isPremium = JSON.parse(audioDto.isPremium);
    const price = Number(audioDto.price);

    const audio = await this.audioModel.findOne({ where: { name } });
    if (audio) {
      throw new HttpException(
        'Audio file with that name already exists',
        HttpStatus.CONFLICT,
      );
    }
    const upload = await this.cloudinaryService.uploadFile(file);

    const audioObject = await this.audioModel.create({
      name,
      audioUrl: upload.url,
      description,
      duration,
      price,
      isPremium,
    });

    try {
      for (let genre of genres) {
        await this.audioGenreService.create({
          audioId: audioObject.id!,
          genreId: genre,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        audioObject.destroy();
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    return audioObject;
  }

  async findByGenre(genreId: number): Promise<Audio[]> {
    const genre = await this.audioGenreService.findByGenre(genreId);
    return this.audioModel.findAll({
      where: {
        id: genre.map((g: AudioGenre) => g.audioId),
      },
    });
  }
}
