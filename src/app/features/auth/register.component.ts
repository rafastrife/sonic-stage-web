import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../core/stores/auth.store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div class="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Join SonicStage</h1>
          <p class="text-neutral-400 mt-2">Create your account to start managing your band.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Display Name</label>
            <input type="text" formControlName="display_name" 
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white"
              placeholder="John Doe">
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Username</label>
            <input type="text" formControlName="username" 
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white"
              placeholder="johndoe">
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input type="email" formControlName="email" 
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white"
              placeholder="john@example.com">
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input type="password" formControlName="password"
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading"
            class="w-full py-3 px-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="text-center text-neutral-400 mt-6 text-sm">
          Already have an account? 
          <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  isLoading = false;
  registerForm = this.fb.nonNullable.group({
    display_name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authStore.register(this.registerForm.getRawValue()).subscribe({
        error: () => {
          this.isLoading = false;
          alert('Registration failed.');
        }
      });
    }
  }
}
