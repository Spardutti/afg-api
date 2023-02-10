import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Error, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AudioGenre } from 'src/audio-genre/audio-genre.model';
import { AudioGenreService } from 'src/audio-genre/audio-genre.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Genre } from 'src/genres/genre.model';
import { Audio } from './audios.model';
import { CreateAudioDto } from './dto/create-audio.dto';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { createReadStream } from 'fs';

@Injectable()
export class AudiosService {
  constructor(
    @InjectModel(Audio)
    private audioModel: typeof Audio,
    private audioGenreService: AudioGenreService,
    private cloudinaryService: CloudinaryService,
    private sequelize: Sequelize,
  ) { }

  async findAll(): Promise<Audio[]> {
    return this.audioModel.findAll({
      order: [
        [this.sequelize.fn('lower', this.sequelize.col('Audio.name')), 'ASC'],
      ],
      include: {
        model: Genre,
        attributes: ['name', 'id'],
      },
    });
  }

  async findByPk(id: number): Promise<Audio> {
    const audio = await this.audioModel.findByPk(id, {
      include: [
        {
          model: Genre,

          attributes: ['name', 'id'],
        },
      ],
    });
    if (!audio)
      throw new HttpException('Audio not found', HttpStatus.NOT_FOUND);
    return audio;
  }

  // Todo edit is working but we are not returning anything on success
  async edit(audio: CreateAudioDto, id: number): Promise<Audio[] | unknown> {
    const { name, description, isPremium, price } = audio;
    const genres: number[] = JSON.parse(audio.genres);
    try {
      return await this.sequelize.transaction(
        async (transaction: Transaction) => {
          const edit = await this.audioModel.update(
            {
              name,
              description,
              isPremium,
              price,
            },
            {
              where: {
                id,
              },
              returning: true,
              transaction,
            },
          );
          const allAudioGenre = await this.audioGenreService.findByAudio(
            edit[1][0].id,
            transaction,
          );
          for (let genre of genres) {
            const audioGenreToDelete = allAudioGenre.filter(
              (ag: AudioGenre) => ag.id != genre,
            );
            for (let ag of audioGenreToDelete) {
              await this.audioGenreService.delete(
                ag.genreId,
                edit[1][0].id,
                transaction,
              );
            }
            const isExist = await this.audioGenreService.findOne(
              edit[1][0].id,
              genre,
              transaction,
            );
            if (isExist) continue;

            await this.audioGenreService.create(
              {
                audioId: edit[1][0].id,
                genreId: genre,
              },
              transaction,
            );
          }
          return edit[1];
        },
      );
    } catch (error) {
      return error.message;
    }
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
  ): Promise<Audio | unknown> {
    const { name, description } = audioDto;
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

    file.filename = file.originalname;
    const upload = await this.cloudinaryService.uploadFile(file);
    const durationInSeconds = await getAudioDurationInSeconds(upload.url);
    const duration = Math.round(Math.floor(durationInSeconds));

    try {
      return await this.sequelize.transaction(
        async (transaction: Transaction) => {
          const audioObject = await this.audioModel.create(
            {
              name,
              audioUrl: upload.url,
              description,
              duration: duration,
              price,
              isPremium,
            },
            { transaction },
          );

          for (let genre of genres) {
            await this.audioGenreService.create(
              {
                audioId: audioObject.id!,
                genreId: genre,
              },
              transaction,
            );
          }
          return audioObject;
        },
      );
    } catch (error) {
      return error.message;
    }
  }

  async findByGenre(genreId: number): Promise<Audio[]> {
    return await this.audioModel.findAll({
      include: [
        {
          model: Genre,
          where: {
            id: genreId,
          },
          attributes: [],
        },
      ],
    });
  }
}
