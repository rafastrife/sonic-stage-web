export type SongStatus = 'ACTIVE' | 'REHEARSAL' | 'SUGGESTION';

export const SONG_STATUS_LABELS: Record<SongStatus, string> = {
  ACTIVE: 'Ativa',
  REHEARSAL: 'Em ensaio',
  SUGGESTION: 'Sugestão',
};

export interface Song {
  id: number;
  band: number;
  title: string;
  artist?: string | null;
  genre?: string | null;
  key?: string | null;
  status: SongStatus;
  tuning?: string | null;
  bpm?: number | null;
  duration_seconds?: number | null;
  tags?: string | null;
  spotify_url?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SpotifyTrackPreview {
  title: string;
  artist: string;
  duration_seconds: number | null;
  spotify_url: string;
}

export interface SongPayload {
  title: string;
  artist?: string | null;
  genre?: string | null;
  key?: string | null;
  status?: SongStatus;
  tuning?: string | null;
  bpm?: number | null;
  tags?: string | null;
  spotify_url?: string | null;
}
