// import { AppModule } from './app.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AudiosModule } from './audios/audios.module';
import { GenresModule } from './genres/genres.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AudiosController } from './audios/audios.controller';
import { AudioGenreModule } from './audio-genre/audio-genre.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AudiosModule,
    GenresModule,
    AudioGenreModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AudiosController);
  }
}
