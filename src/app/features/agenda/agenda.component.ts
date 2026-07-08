import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandStore } from '../../core/stores/band.store';

interface AppEvent {
  id?: number;
  band: number;
  band_name?: string;
  title: string;
  date: string; // yyyy-MM-dd
  start_time: string | null;
  end_time: string | null;
  location: string;
  setlist: number | null;
  setlist_name?: string | null;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED';
  notes: string | null;
}

interface SetlistOption {
  id: number;
  name: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: AppEvent[];
}

interface MonthGroup {
  label: string;
  events: AppEvent[];
}

type ViewMode = 'lista' | 'calendario';
type TimeFilter = 'all' | 'upcoming' | 'past';

const BAND_TAG_PALETTE = [
  { bg: 'bg-pink-500/15', border: 'border-pink-500/40', text: 'text-pink-300' },
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', text: 'text-cyan-300' },
  { bg: 'bg-violet-500/15', border: 'border-violet-500/40', text: 'text-violet-300' },
  { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300' },
];

function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toDateOnlyString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto text-white min-h-screen bg-[#121212]">

      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-4xl font-black tracking-tight mb-1">Agenda</h1>
          <p class="text-neutral-400 font-medium">Acompanhe os shows e eventos de todas as suas bandas.</p>
        </div>
        <button (click)="openForm()" class="bg-violet-500 hover:bg-violet-400 text-white px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Novo Evento
        </button>
      </div>

      <!-- View toggle -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div class="flex bg-neutral-900 border border-neutral-800 rounded-full p-1">
          <button (click)="viewMode.set('lista')" [class]="pillClasses(viewMode() === 'lista')">Lista</button>
          <button (click)="viewMode.set('calendario')" [class]="pillClasses(viewMode() === 'calendario')">Calendário</button>
        </div>

        <div class="relative">
          <select
            class="bg-neutral-900 border border-neutral-800 text-white rounded-full pl-4 pr-9 py-2.5 appearance-none cursor-pointer focus:outline-none focus:border-cyan-400 transition-colors text-sm font-medium"
            [value]="bandFilter()"
            (change)="onBandFilterChange($event)">
            <option value="all">Todas as Bandas</option>
            <option *ngFor="let band of bandStore.userBands()" [value]="band.id">{{ band.name }}</option>
          </select>
        </div>

        <div class="flex bg-neutral-900 border border-neutral-800 rounded-full p-1">
          <button (click)="setTimeFilter('all')" [class]="pillClasses(timeFilter() === 'all')">Todos</button>
          <button (click)="setTimeFilter('upcoming')" [class]="pillClasses(timeFilter() === 'upcoming')">Próximos</button>
          <button (click)="setTimeFilter('past')" [class]="pillClasses(timeFilter() === 'past')">Passados</button>
        </div>
      </div>

      <!-- Lista view -->
      <div *ngIf="viewMode() === 'lista'" class="space-y-8">
        <div *ngFor="let group of monthGroups()">
          <div class="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
            <h2 class="text-sm font-bold uppercase tracking-widest text-neutral-300">{{ group.label }}</h2>
            <span class="text-xs text-neutral-500">{{ group.events.length }} evento{{ group.events.length === 1 ? '' : 's' }}</span>
          </div>

          <div class="space-y-4">
            <div *ngFor="let ev of group.events" class="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5 flex items-start gap-5">
              <div class="flex flex-col items-center w-14 flex-shrink-0">
                <span class="text-[11px] font-bold uppercase tracking-widest text-cyan-400">{{ monthAbbrev(ev.date) }}</span>
                <span class="text-3xl font-black leading-none">{{ dayNumber(ev.date) }}</span>
                <span class="text-[11px] uppercase text-neutral-500">{{ weekdayAbbrev(ev.date) }}</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="text-lg font-bold text-white">{{ ev.title }}</h3>
                </div>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400 mb-3">
                  <span *ngIf="ev.location" class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {{ ev.location }}
                  </span>
                  <span *ngIf="timeRange(ev)" class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ timeRange(ev) }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span [class]="bandTagClasses(ev.band)">{{ ev.band_name }}</span>
                  <span *ngIf="ev.setlist_name" class="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium px-3 py-1 rounded-full">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    {{ ev.setlist_name }}
                  </span>
                  <span *ngIf="!ev.setlist_name" class="text-xs text-neutral-600 italic">Sem setlist vinculada</span>
                </div>
              </div>

              <span [class]="statusClasses(ev.status)">{{ statusLabel(ev.status) }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="monthGroups().length === 0" class="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-neutral-800">
          <p class="text-neutral-500 font-medium">Nenhum evento encontrado para os filtros selecionados.</p>
        </div>
      </div>

      <!-- Calendário view -->
      <div *ngIf="viewMode() === 'calendario'" class="bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl select-none">
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div class="flex items-center gap-4">
            <button (click)="previousMonth()" class="text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-colors border border-neutral-800 bg-neutral-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h2 class="text-xl font-bold">{{ currentMonthName() }} {{ currentYear() }}</h2>
            <button (click)="nextMonth()" class="text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-colors border border-neutral-800 bg-neutral-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          <button (click)="goToToday()" class="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">Hoje</button>
        </div>

        <div class="grid grid-cols-7 border-b border-neutral-800 bg-[#181818]">
          <div *ngFor="let day of ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" class="py-3 text-center text-xs font-bold text-neutral-500 tracking-widest uppercase">
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 bg-neutral-800 gap-[1px]">
          <div *ngFor="let day of calendarDays()"
               (dblclick)="onDayDoubleClick(day.date)"
               class="bg-[#1a1a1a] min-h-[110px] p-2 transition-colors hover:bg-[#222] cursor-pointer"
               [ngClass]="{'opacity-40': !day.isCurrentMonth}">
            <div class="flex justify-center items-center w-7 h-7 rounded-full mb-2 text-sm font-medium"
                 [ngClass]="{
                   'bg-cyan-300 text-neutral-900 font-bold': day.isToday,
                   'text-white': !day.isToday && day.isCurrentMonth,
                   'text-neutral-600': !day.isCurrentMonth
                 }">
              {{ day.date.getDate() }}
            </div>
            <div class="space-y-1 pointer-events-none">
              <div *ngFor="let ev of day.events" [class]="calendarChipClasses(ev.status)">
                {{ ev.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Novo Evento Modal -->
      <div *ngIf="isFormOpen()" class="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto py-10 px-4">
        <div class="bg-[#181818] border border-neutral-800 rounded-2xl p-6 w-full max-w-lg">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-white">Novo Evento</h3>
              <p class="text-sm text-neutral-500">Adicione um show ou evento à agenda</p>
            </div>
            <button (click)="closeForm()" class="text-neutral-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form [formGroup]="eventForm" (ngSubmit)="submitForm()" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-1.5">Nome do evento *</label>
              <input type="text" formControlName="title" placeholder="Ex: Show no Bar do Rock"
                class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
              <p *ngIf="submitted() && eventForm.get('title')?.invalid" class="text-xs text-red-400 mt-1">Informe o nome do evento.</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-1.5">Banda *</label>
              <select formControlName="band" (change)="onFormBandChange()"
                class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
                <option [ngValue]="null">Selecionar banda</option>
                <option *ngFor="let band of bandStore.userBands()" [ngValue]="band.id">{{ band.name }}</option>
              </select>
              <p *ngIf="submitted() && eventForm.get('band')?.invalid" class="text-xs text-red-400 mt-1">Selecione uma banda.</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-1.5">Setlist vinculada</label>
              <select formControlName="setlist"
                class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
                <option [ngValue]="null">Nenhuma (opcional)</option>
                <option *ngFor="let sl of formSetlists()" [ngValue]="sl.id">{{ sl.name }}</option>
              </select>
              <p class="text-xs text-neutral-600 mt-1">A setlist ficará associada a este evento</p>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="block text-sm font-bold text-neutral-300 mb-1.5">Data *</label>
                <input type="date" formControlName="date"
                  class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
              </div>
              <div class="col-span-1">
                <label class="block text-sm font-bold text-neutral-300 mb-1.5">Horário início</label>
                <input type="time" formControlName="start_time"
                  class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
              </div>
              <div class="col-span-1">
                <label class="block text-sm font-bold text-neutral-300 mb-1.5">Horário fim</label>
                <input type="time" formControlName="end_time"
                  class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-3 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
              </div>
            </div>
            <p *ngIf="submitted() && eventForm.get('date')?.invalid" class="text-xs text-red-400 -mt-2">Informe a data do evento.</p>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-1.5">Local</label>
              <input type="text" formControlName="location" placeholder="Ex: Bar do Rock, São Paulo"
                class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors">
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-2">Status</label>
              <div class="grid grid-cols-3 gap-3">
                <button type="button" (click)="setStatus('CONFIRMED')"
                  [class]="statusButtonClasses('CONFIRMED')">Confirmado</button>
                <button type="button" (click)="setStatus('PENDING')"
                  [class]="statusButtonClasses('PENDING')">Pendente</button>
                <button type="button" (click)="setStatus('CANCELED')"
                  [class]="statusButtonClasses('CANCELED')">Cancelado</button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-neutral-300 mb-1.5">Observações</label>
              <textarea formControlName="notes" rows="3" placeholder="Informações adicionais sobre o evento..."
                class="w-full bg-[#0e0e0e] border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" (click)="closeForm()" class="px-6 py-3 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" class="bg-violet-500 hover:bg-violet-400 text-white px-6 py-3 rounded-xl font-bold transition-colors">Salvar Evento</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent implements OnInit {
  bandStore = inject(BandStore);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  events = signal<AppEvent[]>([]);
  viewMode = signal<ViewMode>('lista');
  bandFilter = signal<number | 'all'>('all');
  timeFilter = signal<TimeFilter>('all');
  currentDate = signal(new Date());

  isFormOpen = signal(false);
  submitted = signal(false);
  formSetlists = signal<SetlistOption[]>([]);

  eventForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    band: this.fb.control<number | null>(null, Validators.required),
    setlist: this.fb.control<number | null>(null),
    date: ['', Validators.required],
    start_time: [''],
    end_time: [''],
    location: [''],
    status: ['CONFIRMED'],
    notes: ['']
  });

  monthGroups = computed<MonthGroup[]>(() => {
    const groups: MonthGroup[] = [];
    const byKey = new Map<string, MonthGroup>();
    for (const ev of this.events()) {
      const d = parseDateOnly(ev.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      let group = byKey.get(key);
      if (!group) {
        const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
        group = { label, events: [] };
        byKey.set(key, group);
        groups.push(group);
      }
      group.events.push(ev);
    }
    return groups;
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    if (lastDay.getDay() !== 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    }

    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = new Date();
    const evs = this.events();

    for (let i = 0; i < 42; i++) {
      if (current > endDate && i % 7 === 0) break;

      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.getDate() === today.getDate() &&
                      current.getMonth() === today.getMonth() &&
                      current.getFullYear() === today.getFullYear();

      const dayEvents = evs.filter(e => {
        const eDate = parseDateOnly(e.date);
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

  ngOnInit() {
    this.loadEvents();
  }

  pillClasses(active: boolean): string {
    return active
      ? 'px-5 py-2 rounded-full bg-violet-500 text-white font-medium text-sm transition-colors'
      : 'px-5 py-2 rounded-full text-neutral-400 hover:text-white font-medium text-sm transition-colors';
  }

  bandTagClasses(bandId: number): string {
    const idx = this.bandStore.userBands().findIndex(b => b.id === bandId);
    const palette = BAND_TAG_PALETTE[(idx >= 0 ? idx : 0) % BAND_TAG_PALETTE.length];
    return `text-xs font-bold px-3 py-1 rounded-full border ${palette.bg} ${palette.border} ${palette.text}`;
  }

  statusLabel(status: string): string {
    if (status === 'PENDING') return 'Pendente';
    if (status === 'CANCELED') return 'Cancelado';
    return 'Confirmado';
  }

  statusClasses(status: string): string {
    const base = 'text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0';
    if (status === 'PENDING') return `${base} bg-amber-500/15 text-amber-300`;
    if (status === 'CANCELED') return `${base} bg-red-500/15 text-red-300`;
    return `${base} bg-emerald-500/15 text-emerald-300`;
  }

  calendarChipClasses(status: string): string {
    const base = 'rounded px-2 py-1 text-[10px] font-medium truncate';
    if (status === 'PENDING') return `${base} bg-amber-500/20 text-amber-300`;
    if (status === 'CANCELED') return `${base} bg-red-500/20 text-red-300 line-through`;
    return `${base} bg-emerald-500/20 text-emerald-300`;
  }

  statusButtonClasses(status: string): string {
    const selected = this.eventForm.get('status')?.value === status;
    return selected
      ? 'py-2.5 rounded-lg border-2 border-emerald-400 text-emerald-300 font-bold text-sm transition-colors'
      : 'py-2.5 rounded-lg border border-neutral-800 bg-[#0e0e0e] text-neutral-400 hover:border-neutral-600 font-bold text-sm transition-colors';
  }

  setStatus(status: string) {
    this.eventForm.patchValue({ status });
  }

  dayNumber(dateStr: string): number {
    return parseDateOnly(dateStr).getDate();
  }

  monthAbbrev(dateStr: string): string {
    return parseDateOnly(dateStr).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  }

  weekdayAbbrev(dateStr: string): string {
    return parseDateOnly(dateStr).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
  }

  timeRange(ev: AppEvent): string {
    if (ev.start_time && ev.end_time) return `${ev.start_time.slice(0, 5)} - ${ev.end_time.slice(0, 5)}`;
    if (ev.start_time) return ev.start_time.slice(0, 5);
    return '';
  }

  currentMonthName() {
    return this.currentDate().toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase());
  }

  currentYear() {
    return this.currentDate().getFullYear();
  }

  previousMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
  }

  nextMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  onBandFilterChange(event: any) {
    const value = event.target.value;
    this.bandFilter.set(value === 'all' ? 'all' : Number(value));
    this.loadEvents();
  }

  setTimeFilter(filter: TimeFilter) {
    this.timeFilter.set(filter);
    this.loadEvents();
  }

  loadEvents() {
    let params = new HttpParams();
    const band = this.bandFilter();
    if (band !== 'all') params = params.set('band', band);
    if (this.timeFilter() !== 'all') params = params.set('timeframe', this.timeFilter());

    this.http.get<AppEvent[]>('/api/events/', { params }).subscribe({
      next: (data) => this.events.set(data),
      error: () => this.events.set([])
    });
  }

  onDayDoubleClick(date: Date) {
    const prefillBand = this.bandFilter() !== 'all' ? this.bandFilter() as number : null;
    this.openForm(date, prefillBand);
  }

  openForm(prefillDate?: Date, prefillBand?: number | null) {
    this.submitted.set(false);
    this.eventForm.reset({
      title: '',
      band: prefillBand ?? null,
      setlist: null,
      date: prefillDate ? toDateOnlyString(prefillDate) : '',
      start_time: '',
      end_time: '',
      location: '',
      status: 'CONFIRMED',
      notes: ''
    });
    this.formSetlists.set([]);
    if (prefillBand) {
      this.loadSetlistsForBand(prefillBand);
    }
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
  }

  onFormBandChange() {
    const bandId = this.eventForm.get('band')?.value;
    this.eventForm.patchValue({ setlist: null });
    this.formSetlists.set([]);
    if (bandId) {
      this.loadSetlistsForBand(bandId);
    }
  }

  private loadSetlistsForBand(bandId: number) {
    this.http.get<SetlistOption[]>(`/api/bands/${bandId}/setlists/`).subscribe({
      next: (data) => this.formSetlists.set(data),
      error: () => this.formSetlists.set([])
    });
  }

  submitForm() {
    this.submitted.set(true);
    if (this.eventForm.invalid) return;

    const raw = this.eventForm.getRawValue();
    const bandId = raw.band as number;

    const payload = {
      title: raw.title,
      date: raw.date,
      start_time: raw.start_time || null,
      end_time: raw.end_time || null,
      location: raw.location || '',
      setlist: raw.setlist || null,
      status: raw.status,
      notes: raw.notes || null
    };

    this.http.post(`/api/bands/${bandId}/events/`, payload).subscribe({
      next: () => {
        this.isFormOpen.set(false);
        this.loadEvents();
        if (typeof (this.bandStore as any).refreshDashboard === 'function') {
          (this.bandStore as any).refreshDashboard();
        }
      }
    });
  }
}
