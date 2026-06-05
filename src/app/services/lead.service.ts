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
  private apiUrl = '/api/leads/waitlist';

  /**
   * Registra um lead na lista de espera.
   * Por enquanto, se a API não existir, simula um delay para demonstração.
   */
  registerLead(payload: LeadPayload): Observable<LeadResponse> {
    // Note: To actually call the backend, uncomment the below code once the backend is ready
    // return this.http.post<LeadResponse>(this.apiUrl, payload);
    
    // Mock implementation for the Landing Page Launch demonstration
    return new Observable<LeadResponse>(observer => {
      setTimeout(() => {
        if (payload.email && payload.email.includes('@')) {
          observer.next({ success: true, message: 'Você foi adicionado à lista de espera com sucesso!' });
        } else {
          observer.next({ success: false, errors: { email: ['Informe um e-mail válido.'] } });
        }
        observer.complete();
      }, 1000);
    });
  }
}
