import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/stores/auth.store';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo.component';

@Component({
  selector: 'app-forgot-password',
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
          <p class="text-neon-cyan text-xs font-bold tracking-widest mt-2 uppercase">Recuperar Senha</p>
        </div>

        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm text-center">
          {{ successMessage }}
        </div>

        <form *ngIf="!successMessage" [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <p class="text-neutral-400 text-sm text-center mb-4">
            Digite seu e-mail de cadastro. Se ele existir em nossa base, enviaremos um link de recuperação.
          </p>

          <div>
            <label class="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">E-mail</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input type="email" formControlName="email" 
                class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                placeholder="email@exemplo.com">
            </div>
          </div>

          <button type="submit" [disabled]="forgotForm.invalid || isLoading"
            class="w-full mt-4 py-3.5 px-4 bg-neon-cyan text-black rounded-xl font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="flex items-center justify-center">
              {{ isLoading ? 'Enviando...' : 'Enviar Link' }}
            </span>
          </button>
        </form>

        <p class="text-center text-neutral-400 mt-8 text-sm">
          Lembrou a senha? 
          <a routerLink="/login" class="text-neon-pink hover:text-pink-400 font-bold transition-colors">Voltar ao Login</a>
        </p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  isLoading = false;
  successMessage = '';
  
  forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.authStore.requestPasswordReset(this.forgotForm.getRawValue()).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Se o e-mail existir, um link de recuperação foi enviado.';
        },
        error: () => {
          this.isLoading = false;
          this.successMessage = 'Se o e-mail existir, um link de recuperação foi enviado.';
        }
      });
    }
  }
}
