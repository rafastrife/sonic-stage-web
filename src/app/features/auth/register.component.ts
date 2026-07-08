import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../core/stores/auth.store';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo.component';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, GoogleButtonComponent],
  template: `
    <div class="min-h-screen flex bg-[#0a0a0a] text-white">
      
      <!-- Left Panel -->
      <div class="hidden lg:flex lg:w-1/2 flex-col p-12 border-r border-white/5 relative overflow-hidden">
        
        <div class="z-10 mb-8">
          <app-logo class="w-64 mb-8 block"></app-logo>
          <p class="text-2xl font-medium text-neutral-300 leading-snug max-w-md">
            Entre no mundo de alta energia da performance digital. Crie, transmita e conecte-se com pura fidelidade.
          </p>
        </div>

        <div class="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent z-10"></div>
        
        <!-- Abstract stage visualization -->
        <div class="absolute bottom-0 left-0 w-full h-2/3 opacity-30 flex items-end justify-center pb-10">
          <div class="w-full h-full flex items-end justify-center space-x-8 px-10">
             <div class="w-1/4 h-3/4 bg-neutral-800 rounded-t-3xl relative">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-neon-cyan rounded-full blur-[2px]"></div>
             </div>
             <div class="w-1/3 h-full bg-neutral-800 rounded-t-3xl relative">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-neon-pink rounded-full blur-[4px]"></div>
             </div>
             <div class="w-1/4 h-2/3 bg-neutral-800 rounded-t-3xl relative">
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-neon-cyan rounded-full blur-[2px]"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-2">Entrar no Palco</h2>
            <p class="text-neutral-400">Registre sua conta para acessar o palco.</p>
          </div>

          <app-google-button buttonText="signup_with"></app-google-button>
          <div class="flex items-center my-6">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="mx-4 text-xs text-neutral-500 uppercase tracking-widest">ou com e-mail</span>
            <div class="flex-grow border-t border-white/10"></div>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-2">Nome de Artista / Exibição</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input type="text" formControlName="display_name" 
                  class="w-full pl-11 pr-4 py-3 bg-[#121212] border border-white/10 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                  placeholder="ex. Neon Pulse">
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-2">Endereço de E-mail</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input type="email" formControlName="email" 
                  class="w-full pl-11 pr-4 py-3 bg-[#121212] border border-white/10 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                  placeholder="voce@exemplo.com">
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-2">Senha</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password"
                  class="w-full pl-11 pr-11 py-3 bg-[#121212] border border-white/10 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
                  placeholder="••••••••">
                <button type="button" (click)="togglePassword()" class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-2">Função Principal</label>
              <div class="grid grid-cols-2 gap-3">
                <button type="button" *ngFor="let role of roles" 
                  (click)="selectRole(role.id)"
                  [class]="registerForm.get('main_role')?.value === role.id 
                    ? 'border-neon-pink bg-neon-pink/10 text-white' 
                    : 'border-white/10 bg-[#121212] text-neutral-400 hover:border-white/30'"
                  class="flex items-center justify-center space-x-2 py-3 border rounded-lg transition-all">
                  <span>{{role.icon}}</span>
                  <span class="text-sm font-medium">{{role.label}}</span>
                </button>
              </div>
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading"
              class="w-full mt-6 py-3.5 px-4 bg-neon-cyan text-black rounded-lg font-bold tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              <span>{{ isLoading ? 'Criando...' : 'Criar Conta' }}</span>
              <svg *ngIf="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </form>

          <p class="text-center text-neutral-400 mt-8 text-sm">
            Já faz parte da equipe? 
            <a routerLink="/login" class="text-neon-pink hover:text-pink-400 font-bold transition-colors">Entre aqui</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  showPassword = false;
  
  roles = [
    { id: 'vocalista', label: 'Vocalista', icon: '🎤' },
    { id: 'cordas', label: 'Cordas', icon: '🎸' },
    { id: 'percussao', label: 'Percussão', icon: '🥁' },
    { id: 'teclas', label: 'Teclas', icon: '🎹' },
    { id: 'produtor', label: 'Produtor', icon: '🎛️' },
    { id: 'ouvinte', label: 'Ouvinte', icon: '🎧' }
  ];

  registerForm = this.fb.nonNullable.group({
    display_name: ['', Validators.required],
    username: [''], // Will auto-generate or use email prefix if empty
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    main_role: ['', Validators.required]
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  selectRole(roleId: string) {
    this.registerForm.patchValue({ main_role: roleId });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.getRawValue();
      
      // Use email as username to guarantee uniqueness and avoid duplicate prefix errors
      if (!formValue.username) {
        formValue.username = formValue.email;
      }

      this.authStore.register(formValue).subscribe({
        next: () => {
          this.isLoading = false;
          const redirect = this.route.snapshot.queryParamMap.get('redirect');
          this.router.navigate(['/login'], redirect ? { queryParams: { redirect } } : {});
        },
        error: (err) => {
          this.isLoading = false;
          console.error("Registration error:", err);
          alert('Erro ao criar conta. Verifique os dados e tente novamente.');
        }
      });
    }
  }
}
