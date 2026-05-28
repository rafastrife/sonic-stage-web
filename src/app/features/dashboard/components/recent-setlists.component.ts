import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-setlists',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <div class="mt-12">
      <div class="flex justify-between items-end mb-6">
        <h2 class="text-3xl font-bold text-white tracking-tight">Setlists Recentes</h2>
        <a routerLink="/dashboard/repertoire" class="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1 transition-colors">
          Ver Todos 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let setlist of setlists" class="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors cursor-pointer group">
          <div class="flex justify-between items-start mb-8">
            <div class="w-10 h-10 bg-neutral-800 group-hover:bg-neutral-700 transition-colors rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span class="text-neutral-500 text-xs font-medium">{{ setlist.status === 'Rascunho' ? 'Rascunho' : 'Última vez: ' + (setlist.updated_at | date:'dd MMM') }}</span>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2">{{ setlist.name }}</h3>
          <p class="text-neutral-400 text-sm">{{ setlist.total_tracks }} Faixas &bull; {{ formatDuration(setlist.duration_seconds) }}</p>
        </div>

        <!-- Empty state if less than 3 -->
        <div *ngIf="!setlists || setlists.length === 0" class="col-span-3 py-12 text-center text-neutral-500">
          Nenhuma setlist encontrada. Crie sua primeira setlist.
        </div>
      </div>
    </div>
  `
})
export class RecentSetlistsComponent {
  @Input() setlists: any[] = [];

  formatDuration(seconds: number): string {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  }
}
