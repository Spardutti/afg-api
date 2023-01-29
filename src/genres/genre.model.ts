import { Column, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { AudioGenre } from 'src/audio-genre/audio-genre.model';
import { Audio } from 'src/audios/audios.model';

@Table
export class Genre extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Audio, () => AudioGenre)
  audio: Audio[];
}
