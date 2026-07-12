import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song, SongPayload, SpotifyTrackPreview } from '../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private http = inject(HttpClient);

  private base(bandId: number): string {
    return `/api/bands/${bandId}/songs`;
  }

  list(bandId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.base(bandId)}/`);
  }

  create(bandId: number, payload: SongPayload): Observable<Song> {
    return this.http.post<Song>(`${this.base(bandId)}/`, payload);
  }

  update(bandId: number, songId: number, payload: Partial<SongPayload>): Observable<Song> {
    return this.http.patch<Song>(`${this.base(bandId)}/${songId}/`, payload);
  }

  delete(bandId: number, songId: number): Observable<void> {
    return this.http.delete<void>(`${this.base(bandId)}/${songId}/`);
  }

  usages(bandId: number, songId: number): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.base(bandId)}/${songId}/usages/`
    );
  }

  reorder(bandId: number, orderedSongIds: number[]): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.base(bandId)}/reorder/`, {
      ordered_song_ids: orderedSongIds,
    });
  }

  lookupSpotify(bandId: number, url: string): Observable<SpotifyTrackPreview> {
    return this.http.post<SpotifyTrackPreview>(`${this.base(bandId)}/lookup_spotify/`, { url });
  }
}
