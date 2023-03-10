import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAudioDto } from './dto/create-audio.dto';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudioInterface } from './interfaces/audio.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Patch, UploadedFile } from '@nestjs/common/decorators';
import { Audio } from './audios.model';

@Controller('audio')
export class AudiosController {
  constructor(
    private audiosService: AudiosService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get()
  async findAll(): Promise<AudioInterface[]> {
    return this.audiosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Audio> {
    return this.audiosService.findByPk(id);
  }

  @Get('genre/:id')
  async findByGenre(@Param('id') id: number): Promise<Audio[]> {
    return this.audiosService.findByGenre(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('audioFile'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAudioDto: CreateAudioDto,
  ) {
    return this.audiosService.create(createAudioDto, file);
  }

  @Patch(':id')
  async edit(@Body() createAudioDto: CreateAudioDto, @Param('id') id: number) {
    return this.audiosService.edit(createAudioDto, id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.audiosService.remove(id);
  }
}
