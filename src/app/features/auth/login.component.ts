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
    <div class="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div class="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">SonicStage</h1>
          <p class="text-neutral-400 mt-2">Welcome back! Please login to your account.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Username</label>
            <input type="text" formControlName="username" 
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
              placeholder="johndoe">
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input type="password" formControlName="password"
              class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white placeholder-neutral-600"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-neutral-400 mt-6 text-sm">
          Don't have an account? 
          <a routerLink="/register" class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one now</a>
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
