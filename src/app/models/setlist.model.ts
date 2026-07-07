import { Song } from './song.model';

export interface SetlistSong {
  id: number;
  song: Song;
  order_index: number;
}

export interface Setlist {
  id: number;
  band: number;
  name: string;
  created_at: string;
  songs: SetlistSong[];
}
