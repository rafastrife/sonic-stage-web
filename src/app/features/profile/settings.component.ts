import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { GoogleButtonComponent } from '../auth/components/google-button/google-button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, GoogleButtonComponent],
  template: `
    <div class="p-8">
      <h2 class="text-3xl font-bold mb-6 text-white">Configurações de Conta</h2>
      
      <div class="bg-[#121212] border border-white/10 rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Integrações</h3>
        
        <div class="flex items-center justify-between py-4 border-b border-white/5">
          <div>
            <h4 class="font-bold text-neutral-200">Google Account</h4>
            <p class="text-sm text-neutral-400">Vincule sua conta Google para login rápido.</p>
          </div>
          
          <div class="flex flex-col items-center">
            <app-google-button buttonText="continue_with" action="link"></app-google-button>
            <button (click)="unlinkGoogle()" class="mt-2 text-xs font-bold text-neon-pink hover:underline uppercase tracking-wider">
              Desvincular Google
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private googleAuthService = inject(GoogleAuthService);

  unlinkGoogle() {
    if (confirm('Tem certeza que deseja desvincular sua conta Google?')) {
      this.googleAuthService.unlinkGoogleAccount().subscribe({
        next: () => alert('Conta desvinculada com sucesso.'),
        error: (err: any) => {
          if (err.error?.error) {
            alert(err.error.error);
          } else {
            alert('Erro ao desvincular.');
          }
        }
      });
    }
  }
}
