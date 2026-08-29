import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_NOT_VERIFIED: 'Sua conta Google precisa ter o e-mail confirmado.',
  ACCOUNT_EXISTS_LINK_REQUIRED:
    'Já existe uma conta com este e-mail. Entre com sua senha e vincule o Google em Perfil.',
};

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  googleLogin(idToken: string) {
    return this.http.post<{access: string, refresh: string, user: any}>('/api/auth/google/', { id_token: idToken }).pipe(
      tap(response => {
        this.authStore.setSession(response.access, response.user, false);
        window.dispatchEvent(new CustomEvent('auth:session-ready'));
        this.router.navigate(['/dashboard']);
      }),
      catchError((err: HttpErrorResponse) => throwError(() => new Error(this.googleLoginErrorMessage(err))))
    );
  }

  private googleLoginErrorMessage(err: HttpErrorResponse): string {
    const code = err.error?.code as string | undefined;
    return (code && GOOGLE_ERROR_MESSAGES[code])
      || 'Falha ao autenticar com o Google. Tente novamente.';
  }

  linkGoogleAccount(idToken: string) {
    return this.http.post('/api/auth/google/link/', { id_token: idToken });
  }

  unlinkGoogleAccount() {
    return this.http.post('/api/auth/google/unlink/', {});
  }
}
