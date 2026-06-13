import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { LeadPayload, LeadResponse } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  // Using a mock endpoint or real endpoint depending on the environment
  private apiUrl = 'http://localhost:8000/api/leads/waitlist/';

  /**
   * Registra um lead na lista de espera.
   */
  registerLead(payload: LeadPayload): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(this.apiUrl, payload).pipe(
      catchError(error => {
        const errorMessage = error.error?.errors?.email?.[0] || 'Ocorreu um erro ao registrar. Tente novamente.';
        return of({ success: false, errors: { email: [errorMessage] } } as LeadResponse);
      })
    );
  }
}
