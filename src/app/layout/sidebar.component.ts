import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandStore } from '../core/stores/band.store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CreateBandModalComponent } from '../features/dashboard/components/create-band-modal.component';
import { LogoComponent } from '../shared/components/logo.component';
import { AuthStore } from '../core/stores/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CreateBandModalComponent, LogoComponent],
  template: `
    <div class="w-64 h-screen bg-[#0a0a0a] border-r border-neutral-800 flex flex-col pt-6 pb-6 text-neutral-400 font-medium">
      
      <!-- Logo -->
      <div class="px-8 mb-10 mt-2 flex items-center">
        <app-logo class="w-48"></app-logo>
      </div>

      <!-- Band Selector -->
      <div class="px-6 mb-8 relative">
        <div class="text-xs font-bold tracking-widest uppercase text-neutral-600 mb-3 px-2">Banda Atual</div>
        
        <select 
          class="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:border-cyan-400 transition-colors"
          [value]="bandStore.activeBandId()"
          (change)="onBandChange($event)">
          <option *ngFor="let band of bandStore.userBands()" [value]="band.id">
            {{ band.name }}
          </option>
        </select>
        
        <div class="absolute right-10 top-11 pointer-events-none text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow px-4">
        <div class="text-xs font-bold tracking-widest uppercase text-neutral-600 mb-3 px-4">Menu</div>
        
        <a routerLink="/dashboard" routerLinkActive="bg-neutral-900 text-cyan-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-colors mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </a>
        
        <a routerLink="/dashboard/repertoire" routerLinkActive="bg-neutral-900 text-cyan-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-colors mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Repertório
        </a>
        
        <a routerLink="/dashboard/agenda" routerLinkActive="bg-neutral-900 text-cyan-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-colors mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Agenda
        </a>
        
        <a routerLink="/dashboard/members" routerLinkActive="bg-neutral-900 text-cyan-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-colors mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Membros
        </a>
      </nav>

      <!-- Bottom Actions -->
      <div class="px-6 mt-auto">
        <button (click)="openCreateBandModal()" class="w-full flex items-center justify-center gap-2 py-3 mb-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 text-white transition-colors font-bold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nova Banda
        </button>
        <button (click)="logout()" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-neutral-900/50 text-neutral-400 hover:text-white transition-colors font-bold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>

    </div>
    
    <!-- Modal -->
    <app-create-band-modal></app-create-band-modal>
  `
})
export class SidebarComponent {
  bandStore = inject(BandStore);
  authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }

  onBandChange(event: any) {
    const bandId = Number(event.target.value);
    if (bandId) {
      this.bandStore.setActiveBand(bandId);
    }
  }

  openCreateBandModal() {
    // To be implemented in US3
    const event = new CustomEvent('open-create-band-modal');
    window.dispatchEvent(event);
  }
}
