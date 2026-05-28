import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-4 h-full">
      
      <!-- Repertório Total -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div>
          <h3 class="text-neutral-400 text-xs font-bold tracking-wider mb-2 uppercase">Repertório Total</h3>
          <div class="text-5xl font-extrabold text-cyan-400">{{ metrics?.total_repertoire || 0 }}</div>
        </div>
        <p class="text-cyan-400 text-xs mt-2">+{{ metrics?.repertoire_added_this_month || 0 }} adicionadas este mês</p>
        
        <div class="absolute top-6 right-6 w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      </div>

      <!-- Ensaios Esta Semana -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div>
          <h3 class="text-neutral-400 text-xs font-bold tracking-wider mb-2 uppercase">Ensaios Esta Semana</h3>
          <div class="text-5xl font-extrabold text-pink-400">{{ metrics?.rehearsals_this_week || 0 }}</div>
        </div>
        <p class="text-neutral-400 text-xs mt-2">Próximo: {{ metrics?.next_rehearsal_date ? (metrics?.next_rehearsal_date | date:'EEEE, HH:mm') : 'Nenhum' }}</p>
        
        <div class="absolute top-6 right-6 w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      <!-- Vibe Principal Atual -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex-grow flex flex-col">
        <h3 class="text-neutral-400 text-xs font-bold tracking-wider mb-4 uppercase">Vibe Principal Atual</h3>
        <div class="flex-grow flex items-end justify-between gap-1 mt-2">
          <!-- Mock Chart Bars -->
          <div *ngFor="let val of metrics?.vibe_data" 
               class="w-full rounded-t-sm bg-gradient-to-t from-pink-400 to-cyan-400"
               [style.height.%]="val"></div>
        </div>
      </div>

    </div>
  `
})
export class MetricsCardsComponent {
  @Input() metrics: any;
}
