import {
  Column,
  Model,
  Table,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { AudioGenre } from 'src/audio-genre/audio-genre.model';
import { Genre } from 'src/genres/genre.model';

@Table
export class Audio extends Model {
  @Column
  name: string;

  @Column
  duration: number;

  @Column(DataType.FLOAT)
  price: number;

  @Column
  description: string;

  @Column
  isPremium: boolean;

  @Column
  audioUrl: string;

  @BelongsToMany(() => Genre, () => AudioGenre)
  genre: Genre[];
}
