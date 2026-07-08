import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setlist, SetlistPayload } from '../models/setlist.model';

@Injectable({
  providedIn: 'root',
})
export class SetlistService {
  private http = inject(HttpClient);

  private base(bandId: number): string {
    return `/api/bands/${bandId}/setlists`;
  }

  list(bandId: number): Observable<Setlist[]> {
    return this.http.get<Setlist[]>(`${this.base(bandId)}/`);
  }

  create(bandId: number, payload: SetlistPayload): Observable<Setlist> {
    return this.http.post<Setlist>(`${this.base(bandId)}/`, payload);
  }

  update(bandId: number, setlistId: number, payload: Partial<SetlistPayload>): Observable<Setlist> {
    return this.http.patch<Setlist>(`${this.base(bandId)}/${setlistId}/`, payload);
  }

  delete(bandId: number, setlistId: number): Observable<void> {
    return this.http.delete<void>(`${this.base(bandId)}/${setlistId}/`);
  }

  exportPdf(bandId: number, setlistId: number, theme: 'dark' | 'light'): Observable<Blob> {
    return this.http.get(`${this.base(bandId)}/${setlistId}/export_pdf/?theme=${theme}`, {
      responseType: 'blob',
    });
  }
}
