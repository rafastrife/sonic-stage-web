import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandStore } from '../../core/stores/band.store';

interface Event {
  id?: string;
  title: string;
  type: string;
  date: string;
  location: string;
  status?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col xl:flex-row gap-8 p-8 max-w-7xl mx-auto text-white min-h-screen bg-[#121212]">
      <!-- Main Calendar Area (Left) -->
      <div class="flex-1">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 class="text-5xl font-black tracking-tight mb-2">{{ currentMonthName() }} {{ currentYear() }}</h1>
            <p class="text-neutral-400 font-medium text-lg flex items-center gap-2">
              <span class="text-cyan-400 text-xs">●</span> 
              {{ summary().shows }} Shows Agendados • {{ summary().ensaios }} Ensaios
            </p>
          </div>
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex bg-neutral-900 border border-neutral-800 rounded-full p-1">
              <button class="px-6 py-2 rounded-full bg-neutral-800 text-white font-medium text-sm transition-colors">Mês</button>
              <button class="px-6 py-2 rounded-full text-neutral-400 hover:text-white font-medium text-sm transition-colors">Semana</button>
            </div>
            <button (click)="isAddingEvent = !isAddingEvent" class="bg-cyan-300 hover:bg-cyan-200 text-neutral-900 px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(103,232,249,0.4)]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Novo Evento
            </button>
          </div>
        </div>

        <!-- Add Event Form -->
        <div *ngIf="isAddingEvent" class="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mb-6 backdrop-blur-xl animate-fade-in">
          <h3 class="text-xl font-bold mb-4 text-white">Criar Novo Evento</h3>
          <form [formGroup]="eventForm" (ngSubmit)="addEvent()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-medium text-neutral-400 mb-2">Título do Evento</label>
              <input type="text" formControlName="title" class="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors">
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-400 mb-2">Tipo</label>
              <select formControlName="type" class="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors">
                <option value="SHOW">Show</option>
                <option value="ENSAIO">Ensaio</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-400 mb-2">Data e Hora</label>
              <input type="datetime-local" formControlName="date" class="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors" [value]="eventForm.get('date')?.value | date:'yyyy-MM-ddTHH:mm'">
            </div>
            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-medium text-neutral-400 mb-2">Local</label>
              <input type="text" formControlName="location" class="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors">
            </div>
            <div class="col-span-1 md:col-span-2 flex justify-end mt-2">
              <button type="button" (click)="isAddingEvent = false" class="px-6 py-3 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors mr-2">Cancelar</button>
              <button type="submit" [disabled]="eventForm.invalid" class="bg-cyan-300 text-neutral-900 hover:bg-cyan-200 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                Salvar Evento
              </button>
            </div>
          </form>
        </div>
        
        <!-- Calendar Grid -->
        <div class="bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <!-- Weekdays Header -->
          <div class="grid grid-cols-7 border-b border-neutral-800 bg-[#222]">
            <div *ngFor="let day of ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" class="py-4 text-center text-xs font-bold text-neutral-500 tracking-widest uppercase">
              {{ day }}
            </div>
          </div>
          <!-- Days Grid -->
          <div class="grid grid-cols-7 bg-neutral-800 gap-[1px] border-b border-neutral-800">
             <div *ngFor="let day of calendarDays()" 
                  class="bg-[#1a1a1a] min-h-[140px] p-2 transition-colors hover:bg-[#222]"
                  [ngClass]="{'opacity-50': !day.isCurrentMonth}">
               
               <!-- Day Number -->
               <div class="flex justify-center items-center w-8 h-8 rounded-full mb-2 font-medium"
                    [ngClass]="{
                      'bg-cyan-300 text-neutral-900 font-bold': day.isToday,
                      'text-white': !day.isToday && day.isCurrentMonth,
                      'text-neutral-600': !day.isCurrentMonth
                    }">
                 {{ day.date | date:'d' }}
               </div>

               <!-- Event Chips -->
               <div class="space-y-1.5">
                 <div *ngFor="let ev of day.events" class="w-full">
                   
                   <!-- Ensaio/Viagem Style -->
                   <div *ngIf="ev.type !== 'SHOW'" class="bg-neutral-800 rounded px-2 py-1 text-[11px] flex items-center gap-1.5 truncate text-neutral-300 font-medium">
                     <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                     <span class="truncate">{{ ev.title }}</span>
                   </div>

                   <!-- Show Style -->
                   <div *ngIf="ev.type === 'SHOW'" class="border border-pink-500/50 bg-pink-500/10 rounded p-1.5 text-[10px] text-pink-300 flex flex-col gap-0.5">
                     <div class="flex items-center gap-1 font-bold text-[11px]">
                       <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                       <span class="truncate">{{ ev.title }}</span>
                     </div>
                     <span class="truncate opacity-80">{{ ev.date | date:'HH:mm' }} • {{ ev.location }}</span>
                   </div>

                 </div>
               </div>

             </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar: Upcoming 7 Days -->
      <div class="w-full xl:w-80 flex-shrink-0 mt-8 xl:mt-0">
        <div class="flex items-center gap-3 mb-6">
           <svg class="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <h2 class="text-2xl font-bold leading-tight">Próximos<br/>7 Dias</h2>
           <a href="#" class="ml-auto text-xs font-bold text-pink-400 hover:text-pink-300 tracking-widest uppercase transition-colors">Ver Tudo</a>
        </div>

        <div class="space-y-4">
           
           <div *ngFor="let ev of upcomingEvents()" 
                class="rounded-2xl p-5 relative overflow-hidden group transition-all"
                [ngClass]="{
                  'bg-[#1a1a1a] border-l-4 border-l-cyan-400 border border-[#222]': ev.type !== 'SHOW',
                  'bg-[#1a1a1a] border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]': ev.type === 'SHOW'
                }">
             
             <!-- Decorative Icons based on type -->
             <svg *ngIf="ev.type !== 'SHOW'" class="absolute -right-4 -bottom-4 w-24 h-24 text-neutral-800 opacity-30 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>

             <div class="flex items-center gap-2 mb-2">
               <span class="text-xs font-bold tracking-wider uppercase text-neutral-400">
                 {{ getRelativeDayName(ev.date) }} • {{ ev.date | date:'HH:mm' }}
               </span>
               <span *ngIf="ev.status === 'LIVE' || ev.type === 'SHOW'" class="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Ao Vivo</span>
             </div>
             
             <h3 class="text-xl font-bold text-white mb-3" [ngClass]="{'text-pink-100': ev.type === 'SHOW'}">{{ ev.title }}</h3>
             
             <div class="flex items-start gap-2 text-neutral-400 text-sm font-medium">
               <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               <span class="leading-snug">{{ ev.location }}</span>
             </div>
           </div>

           <div *ngIf="upcomingEvents().length === 0" class="text-center py-10 bg-[#1a1a1a] rounded-2xl border border-neutral-800">
             <p class="text-neutral-500 font-medium">Nenhum evento nos próximos 7 dias.</p>
           </div>
           
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent implements OnInit {
  bandStore = inject(BandStore);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  
  events = signal<Event[]>([]);
  isAddingEvent = false;
  
  currentDate = new Date(); // To drive the current month view

  eventForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    type: ['SHOW', Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    status: ['SCHEDULED']
  });

  // Computed signals
  summary = computed(() => {
    const evs = this.events();
    return {
      shows: evs.filter(e => e.type === 'SHOW').length,
      ensaios: evs.filter(e => e.type === 'ENSAIO').length
    };
  });

  calendarDays = computed(() => {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Find the previous Sunday
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Find the next Saturday
    const endDate = new Date(lastDay);
    if (lastDay.getDay() !== 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    }
    
    // Always show 6 weeks (42 days) for consistent grid height, or at least until endDate
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = new Date();
    
    const evs = this.events();
    
    for (let i = 0; i < 42; i++) {
      if (current > endDate && i % 7 === 0) break; // If we filled the last week, we can stop at 35 days if month is short
      
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.getDate() === today.getDate() && 
                      current.getMonth() === today.getMonth() && 
                      current.getFullYear() === today.getFullYear();
                      
      // Find events for this day
      const dayEvents = evs.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getDate() === current.getDate() && 
               eDate.getMonth() === current.getMonth() && 
               eDate.getFullYear() === current.getFullYear();
      });

      days.push({
        date: new Date(current),
        isCurrentMonth,
        isToday,
        events: dayEvents
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  });

  upcomingEvents = computed(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    return this.events()
      .filter(e => {
        const eDate = new Date(e.date);
        return eDate >= now && eDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Limit to 5 upcoming
  });

  ngOnInit() {
    this.loadEvents();
  }

  currentMonthName() {
    return this.currentDate.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase());
  }
  
  currentYear() {
    return this.currentDate.getFullYear();
  }

  getRelativeDayName(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return 'Hoje';
    } else if (date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    }
  }

  loadEvents() {
    const bandId = this.bandStore.activeBandId();
    if (bandId) {
      this.http.get<Event[]>(`/api/bands/${bandId}/events/`).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.events.set(data);
          } else {
            this.seedMockData();
          }
        },
        error: () => this.seedMockData()
      });
    } else {
      this.seedMockData();
    }
  }

  seedMockData() {
    // Mock data based on the provided image
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const mockEvents: Event[] = [
      { id: '1', title: 'Ensaio (Estúdio A)', type: 'ENSAIO', date: new Date(year, month, now.getDate(), 14, 0).toISOString(), location: 'Espaço de Ensaio no Centro' },
      { id: '2', title: 'Show no Pôr do Sol', type: 'SHOW', date: new Date(year, month, now.getDate() + 1, 20, 0).toISOString(), location: 'The Roxy, West Hollywood', status: 'LIVE' },
      { id: '3', title: 'Ensaio Técnico', type: 'ENSAIO', date: new Date(year, month, now.getDate() + 3, 10, 0).toISOString(), location: 'Montagem do Palco Principal' },
      { id: '4', title: 'Ensaio B', type: 'ENSAIO', date: new Date(year, month, now.getDate() - 2, 18, 0).toISOString(), location: 'Estúdio B' },
      { id: '5', title: 'Sessão de Estúdio', type: 'SHOW', date: new Date(year, month, now.getDate() + 8, 14, 0).toISOString(), location: 'Estúdio Principal' }
    ];
    this.events.set(mockEvents);
  }

  addEvent() {
    const bandId = this.bandStore.activeBandId();
    if (this.eventForm.valid && bandId) {
      this.http.post(`/api/bands/${bandId}/events/`, this.eventForm.getRawValue()).subscribe(() => {
        this.isAddingEvent = false;
        this.eventForm.reset({type: 'SHOW', status: 'SCHEDULED'});
        this.loadEvents();
      });
    } else if (this.eventForm.valid) {
      // Optimistic update for local dev without bandId
      const newEv = this.eventForm.getRawValue() as Event;
      newEv.id = Math.random().toString();
      this.events.set([...this.events(), newEv]);
      this.isAddingEvent = false;
      this.eventForm.reset({type: 'SHOW', status: 'SCHEDULED'});
    }
  }
}
