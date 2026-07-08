import { Component, AfterViewInit, inject, NgZone, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';

declare var google: any;

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full flex justify-center mt-2 mb-2">
      <div #googleBtn></div>
    </div>
  `
})
export class GoogleButtonComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;
  @Input() buttonText: 'signin_with' | 'signup_with' | 'continue_with' = 'signin_with';
  @Input() action: 'login' | 'link' = 'login';

  private googleAuthService = inject(GoogleAuthService);
  private ngZone = inject(NgZone);

  ngAfterViewInit() {
    this.checkAndInitGoogle();
  }

  private checkAndInitGoogle() {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts) {
          clearInterval(interval);
          this.initGoogleButton();
        }
      }, 100);
    }
  }

  private initGoogleButton() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large', text: this.buttonText, width: 300 }
    );
  }

  private handleCredentialResponse(response: any) {
    // The Google Identity Services SDK invokes this callback from outside
    // Angular's zone (its own SDK code, not an Angular-patched event), so
    // change detection never runs for the session/navigation updates below
    // unless we explicitly re-enter the zone here.
    this.ngZone.run(() => {
      if (response.credential) {
        if (this.action === 'login') {
          this.googleAuthService.googleLogin(response.credential).subscribe({
            error: (err) => {
              console.error('Google login failed', err);
              alert('Falha ao autenticar com o Google. Tente novamente.');
            }
          });
        } else if (this.action === 'link') {
          this.googleAuthService.linkGoogleAccount(response.credential).subscribe({
            next: () => alert('Conta vinculada com sucesso!'),
            error: (err) => {
              console.error('Google link failed', err);
              alert(err.error?.error || 'Falha ao vincular com o Google. Tente novamente.');
            }
          });
        }
      }
    });
  }
}
