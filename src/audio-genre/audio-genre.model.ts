import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Audio } from 'src/audios/audios.model';
import { Genre } from 'src/genres/genre.model';

@Table
export class AudioGenre extends Model {
  @ForeignKey(() => Audio)
  @Column
  audioId: number;

  @ForeignKey(() => Genre)
  @Column
  genreId: number;
}
