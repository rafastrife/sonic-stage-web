import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Repertorio } from '../models/repertorio.model';

@Injectable({
  providedIn: 'root'
})
export class RepertorioService {
  private apiUrl = `${environment.apiUrl}/repertorios`;

  constructor(private http: HttpClient) {}

  getRepertorios(): Observable<Repertorio[]> {
    return this.http.get<Repertorio[]>(`${this.apiUrl}/`);
  }

  getRepertorio(id: string): Observable<Repertorio> {
    return this.http.get<Repertorio>(`${this.apiUrl}/${id}/`);
  }

  createRepertorio(repertorio: Repertorio): Observable<Repertorio> {
    return this.http.post<Repertorio>(`${this.apiUrl}/`, repertorio);
  }

  updateRepertorio(id: string, repertorio: Repertorio): Observable<Repertorio> {
    return this.http.put<Repertorio>(`${this.apiUrl}/${id}/`, repertorio);
  }

  deleteRepertorio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  generatePdf(id: string, theme: 'dark' | 'light'): void {
    const url = `${this.apiUrl}/${id}/generate_pdf/?theme=${theme}`;
    window.open(url, '_blank');
  }
}

