import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/stores/auth.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
      <!-- Ambient Glow Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 z-10">
        <div class="text-center mb-10 flex flex-col items-center">
          <app-logo class="w-56 mb-2"></app-logo>
          <p class="text-neon-cyan text-xs font-bold tracking-widest mt-2 uppercase">Nova Senha</p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
          {{ errorMessage }}
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Nova Senha</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <input type="password" formControlName="new_password" 
                class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                placeholder="••••••••">
            </div>
          </div>

          <button type="submit" [disabled]="resetForm.invalid || isLoading"
            class="w-full mt-4 py-3.5 px-4 bg-neon-cyan text-black rounded-xl font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="flex items-center justify-center">
              {{ isLoading ? 'Salvando...' : 'Redefinir Senha' }}
            </span>
          </button>
        </form>

        <p class="text-center text-neutral-400 mt-8 text-sm">
          <a routerLink="/login" class="text-neon-pink hover:text-pink-400 font-bold transition-colors">Voltar ao Login</a>
        </p>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage = '';
  uid = '';
  token = '';

  resetForm = this.fb.nonNullable.group({
    new_password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'] || '';
      this.token = params['token'] || '';
      if (!this.uid || !this.token) {
        this.errorMessage = 'Link inválido. Por favor, solicite a recuperação novamente.';
      }
    });
  }

  onSubmit() {
    if (this.resetForm.valid && this.uid && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      const payload = {
        uid: this.uid,
        token: this.token,
        new_password: this.resetForm.value.new_password
      };

      this.authStore.confirmPasswordReset(payload).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Senha redefinida com sucesso!');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Erro ao redefinir senha. O link pode ter expirado.';
        }
      });
    }
  }
}
