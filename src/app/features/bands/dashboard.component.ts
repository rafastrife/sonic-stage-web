import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandStore } from '../../core/stores/band.store';
import { AuthStore } from '../../core/stores/auth.store';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white flex">
      <!-- Sidebar -->
      <aside class="w-64 border-r border-neutral-800 bg-neutral-900/30 p-6 flex flex-col hidden md:flex">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text mb-10">SonicStage</h2>
        
        <nav class="flex-1 space-y-2">
          <a routerLink="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-medium transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </a>
          <a routerLink="/dashboard/repertoire" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
            Repertório
          </a>
          <a routerLink="/dashboard/agenda" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Agenda
          </a>
          <a routerLink="/dashboard/members" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Membros
          </a>
        </nav>

        <button (click)="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors mt-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Sair
        </button>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <header class="h-20 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-900/20 backdrop-blur-md sticky top-0 z-10">
          <div class="flex items-center gap-4">
            <span class="text-neutral-400 font-medium">Banda Ativa:</span>
            <select *ngIf="bandStore.bands().length > 0; else noBands"
                    [ngModel]="bandStore.activeBand()?.id" 
                    (ngModelChange)="onBandChange($event)"
                    class="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
              <option *ngFor="let band of bandStore.bands()" [value]="band.id">{{ band.name }}</option>
            </select>
            <ng-template #noBands><span class="text-yellow-500 font-medium">Nenhuma banda vinculada</span></ng-template>
          </div>
        </header>

        <div class="p-8 max-w-5xl mx-auto" *ngIf="router.url === '/dashboard'">
          <div class="flex justify-between items-end mb-8">
            <div>
              <h1 class="text-3xl font-bold text-white">Dashboard</h1>
              <p class="text-neutral-400 mt-1">Visão geral do seu projeto musical.</p>
            </div>
            <button (click)="isCreating = !isCreating" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Nova Banda
            </button>
          </div>

          <!-- Create Band Form -->
          <div *ngIf="isCreating" class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8 animate-fade-in-up">
            <h3 class="text-xl font-bold mb-4">Criar nova Banda</h3>
            <form [formGroup]="bandForm" (ngSubmit)="createBand()" class="flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-neutral-400 mb-2">Nome</label>
                <input type="text" formControlName="name" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
              </div>
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-neutral-400 mb-2">Gênero</label>
                <input type="text" formControlName="genre" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
              </div>
              <button type="submit" [disabled]="bandForm.invalid" class="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 h-12">
                Salvar
              </button>
            </form>
          </div>

          <!-- Overview Cards -->
          <div *ngIf="bandStore.activeBand() as active" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
              <div class="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
              </div>
              <h4 class="text-neutral-400 font-medium">Músicas no Repertório</h4>
              <p class="text-3xl font-bold mt-1">--</p>
            </div>
            
            <div class="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6">
              <div class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h4 class="text-neutral-400 font-medium">Eventos Agendados</h4>
              <p class="text-3xl font-bold mt-1">--</p>
            </div>

            <div class="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h4 class="text-neutral-400 font-medium">Membros da Banda</h4>
              <p class="text-3xl font-bold mt-1">--</p>
            </div>
          </div>
          
          <div *ngIf="!bandStore.activeBand()" class="text-center py-20 border-2 border-dashed border-neutral-800 rounded-3xl mt-8">
            <svg class="w-16 h-16 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <h3 class="text-xl font-bold text-neutral-300">Nenhum projeto encontrado</h3>
            <p class="text-neutral-500 mt-2">Crie sua primeira banda para começar a usar o SonicStage.</p>
          </div>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  bandStore = inject(BandStore);
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  router = inject(Router);

  isCreating = false;
  bandForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    genre: ['']
  });

  ngOnInit() {
    this.bandStore.loadBands().subscribe();
  }

  onBandChange(bandId: any) {
    const band = this.bandStore.bands().find(b => b.id == bandId);
    if (band) this.bandStore.setActiveBand(band);
  }

  createBand() {
    if (this.bandForm.valid) {
      this.bandStore.createBand(this.bandForm.getRawValue()).subscribe(() => {
        this.isCreating = false;
        this.bandForm.reset();
      });
    }
  }

  logout() {
    this.authStore.logout();
  }
}
