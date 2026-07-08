import { Song } from './song.model';

export type SetlistStatus = 'DRAFT' | 'READY';

export const SETLIST_STATUS_LABELS: Record<SetlistStatus, string> = {
  DRAFT: 'Rascunho',
  READY: 'Pronta',
};

export interface SetlistSong {
  id: number;
  song: Song;
  order_index: number;
}

export interface Setlist {
  id: number;
  band: number;
  name: string;
  status: SetlistStatus;
  created_at: string;
  songs: SetlistSong[];
}

export interface SetlistPayload {
  name: string;
  status?: SetlistStatus;
  song_ids?: number[];
}
