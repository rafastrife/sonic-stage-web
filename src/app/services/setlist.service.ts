import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setlist } from '../models/setlist.model';

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

  create(bandId: number, name: string): Observable<Setlist> {
    return this.http.post<Setlist>(`${this.base(bandId)}/`, { name });
  }
}
