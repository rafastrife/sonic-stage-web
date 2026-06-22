import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private http = inject(HttpClient);
  private router = inject(Router);

  // State
  private readonly _accessToken = signal<string | null>(localStorage.getItem('access_token'));
  private readonly _user = signal<any | null>(null);

  // Selectors
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly user = computed(() => this._user());

  // Actions
  setSession(access: string, user?: any) {
    localStorage.setItem('access_token', access);
    this._accessToken.set(access);
    if (user) {
      this._user.set(user);
    }
  }

  login(credentials: any) {
    return this.http.post<{access: string, refresh: string}>('/api/auth/login/', credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        this._accessToken.set(response.access);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(data: any) {
    return this.http.post('/api/auth/register/', data).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this._accessToken.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  requestPasswordReset(data: { email: string }) {
    return this.http.post('/api/auth/password-reset/', data);
  }

  confirmPasswordReset(data: any) {
    return this.http.post('/api/auth/password-reset/confirm/', data).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }
}
