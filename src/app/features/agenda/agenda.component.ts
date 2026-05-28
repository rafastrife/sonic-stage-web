import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BandStore } from '../../core/stores/band.store';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Agenda</h1>
          <p class="text-neutral-400 mt-1">Shows e Ensaios programados.</p>
        </div>
        <button (click)="isAddingEvent = !isAddingEvent" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all">+ Novo Evento</button>
      </div>

      <div *ngIf="isAddingEvent" class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8">
        <h3 class="text-xl font-bold mb-4">Criar Novo Evento</h3>
        <form [formGroup]="eventForm" (ngSubmit)="addEvent()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Título do Evento</label>
            <input type="text" formControlName="title" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Tipo</label>
            <select formControlName="type" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
              <option value="SHOW">Show</option>
              <option value="ENSAIO">Ensaio</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-400 mb-2">Data e Hora</label>
            <input type="datetime-local" formControlName="date" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          </div>
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Local</label>
            <input type="text" formControlName="location" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          </div>
          <div class="col-span-1 md:col-span-2 flex justify-end mt-2">
            <button type="submit" [disabled]="eventForm.invalid" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
              Salvar Evento
            </button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let event of events()" class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b"
               [ngClass]="{'from-pink-500 to-rose-500': event.type === 'SHOW', 'from-emerald-500 to-teal-500': event.type === 'ENSAIO'}">
          </div>
          
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-xs font-bold tracking-wider" 
                    [ngClass]="{'text-pink-400': event.type === 'SHOW', 'text-emerald-400': event.type === 'ENSAIO'}">
                {{ event.type }}
              </span>
              <h3 class="text-xl font-bold text-white mt-1">{{ event.title }}</h3>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-white">{{ event.date | date:'dd' }}</div>
              <div class="text-sm font-medium text-neutral-500 uppercase">{{ event.date | date:'MMM' }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 text-neutral-400 text-sm mt-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {{ event.location }}
          </div>
        </div>

        <div *ngIf="events().length === 0" class="col-span-full text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
          <p class="text-neutral-500">Nenhum evento agendado para esta banda.</p>
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent implements OnInit {
  bandStore = inject(BandStore);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  events = signal<any[]>([]);
  isAddingEvent = false;

  eventForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    type: ['SHOW', Validators.required],
    date: ['', Validators.required],
    location: ['', Validators.required],
    status: ['SCHEDULED']
  });

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const band = this.bandStore.activeBand();
    if (band) {
      this.http.get<any[]>(`/api/bands/${band.id}/events/`).subscribe(data => this.events.set(data));
    }
  }

  addEvent() {
    const band = this.bandStore.activeBand();
    if (this.eventForm.valid && band) {
      this.http.post(`/api/bands/${band.id}/events/`, this.eventForm.getRawValue()).subscribe(() => {
        this.isAddingEvent = false;
        this.eventForm.reset({type: 'SHOW', status: 'SCHEDULED'});
        this.loadEvents();
      });
    }
  }
}
