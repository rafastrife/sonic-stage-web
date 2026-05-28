import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-banner',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="relative w-full h-80 rounded-2xl overflow-hidden bg-black flex flex-col justify-end p-8 border border-neutral-800 shadow-lg">
      <!-- Background Image / Gradient Mock -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
        <div class="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/40 via-black to-black opacity-80"></div>
        <!-- Mock laser beams -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[conic-gradient(from_180deg_at_50%_0%,_transparent_45%,_rgba(6,182,212,0.3)_50%,_transparent_55%)] opacity-40"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[conic-gradient(from_180deg_at_50%_0%,_transparent_35%,_rgba(236,72,153,0.2)_50%,_transparent_65%)] opacity-40"></div>
      </div>

      <div class="relative z-20" *ngIf="event">
        <div class="flex items-center gap-4 mb-3">
          <span class="px-3 py-1 bg-pink-950/50 text-pink-400 text-xs font-bold rounded border border-pink-900/50 tracking-wider">PRÓXIMO EVENTO</span>
          <span class="text-neutral-400 text-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ event.location }}
          </span>
        </div>
        <h1 class="text-5xl font-extrabold text-white mb-2 tracking-tight">{{ event.title }}</h1>
        <h2 class="text-xl text-cyan-400 font-bold mb-6">{{ event.date | date:'EEEE, HH:mm' }} EST</h2>
        
        <div class="flex gap-4">
          <button class="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-2.5 rounded-full font-bold transition-colors">
            Ver Cronograma
          </button>
          <button class="bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-6 py-2.5 rounded-full font-bold transition-colors">
            Gerenciar Lista de Convidados
          </button>
        </div>
      </div>

      <div class="relative z-20 flex flex-col items-center justify-center h-full" *ngIf="!event">
        <h1 class="text-3xl font-extrabold text-neutral-500 mb-4 tracking-tight">Nenhum evento agendado</h1>
        <button class="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-2.5 rounded-full font-bold transition-colors">
          Agendar Evento
        </button>
      </div>
    </div>
  `
})
export class EventBannerComponent {
  @Input() event: any;
}
