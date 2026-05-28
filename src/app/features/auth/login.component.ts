import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../core/stores/auth.store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
      <!-- Ambient Glow Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 z-10">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center space-x-1.5 mb-5">
            <div class="w-1.5 h-6 bg-neon-pink rounded-full"></div>
            <div class="w-1.5 h-8 bg-neon-pink rounded-full"></div>
            <div class="w-1.5 h-8 bg-neon-cyan rounded-full"></div>
            <div class="w-1.5 h-8 bg-neon-cyan rounded-full"></div>
            <div class="w-1.5 h-6 bg-neon-cyan rounded-full"></div>
          </div>
          <h1 class="text-3xl font-black text-white tracking-wide uppercase">Sonic Stage</h1>
          <p class="text-neon-cyan text-xs font-bold tracking-widest mt-2 uppercase">Vibe Check HQ</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">E-mail</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input type="text" formControlName="username" 
                class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                placeholder="nome@dominio.com">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Senha</label>
              <a href="#" class="text-xs text-neon-cyan hover:text-white transition-colors">Esqueci a Senha</a>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <input type="password" formControlName="password"
                class="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                placeholder="••••••••">
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
            class="w-full mt-4 py-3.5 px-4 bg-neon-cyan text-black rounded-xl font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="flex items-center justify-center">
              {{ isLoading ? 'Entrando...' : 'Entrar no Palco' }}
              <svg *ngIf="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </form>

        <p class="text-center text-neutral-400 mt-8 text-sm">
          Novo por aqui? 
          <a routerLink="/register" class="text-neon-pink hover:text-pink-400 font-bold transition-colors">Criar Conta</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  isLoading = false;
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authStore.login(this.loginForm.getRawValue()).subscribe({
        error: () => {
          this.isLoading = false;
          alert('Login failed. Check your credentials.');
        }
      });
    }
  }
}
