import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  googleLogin(idToken: string) {
    return this.http.post<{access: string, refresh: string, user: any}>('/api/auth/google/', { id_token: idToken }).pipe(
      tap(response => {
        this.authStore.setSession(response.access, response.user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  linkGoogleAccount(idToken: string) {
    return this.http.post('/api/auth/google/link/', { id_token: idToken });
  }

  unlinkGoogleAccount() {
    return this.http.post('/api/auth/google/unlink/', {});
  }
}
