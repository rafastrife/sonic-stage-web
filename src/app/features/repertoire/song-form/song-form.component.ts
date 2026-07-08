import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Song, SongPayload, SongStatus } from '../../../models/song.model';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-start justify-between mb-1">
          <h3 class="text-xl font-bold text-white">{{ song ? 'Editar Música' : 'Nova Música' }}</h3>
          <button type="button" (click)="cancel.emit()" class="text-neutral-500 hover:text-white transition-colors" aria-label="Fechar">✕</button>
        </div>
        <p class="text-sm text-neutral-400 mb-6">{{ song ? 'Atualize os dados da música.' : 'Adicione uma música ao repertório.' }}</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1">Título da música *</label>
            <input type="text" formControlName="title" placeholder="Ex: Thunderstruck"
                   class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
            @if (form.controls.title.invalid && form.controls.title.touched) {
              <span class="text-xs text-red-500 mt-1 block">O título da música é obrigatório.</span>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1">Artista / Banda</label>
            <input type="text" formControlName="artist" placeholder="Ex: AC/DC"
                   class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
          </div>

          <div class="flex gap-3">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-neutral-300 mb-1">Gênero</label>
              <input type="text" formControlName="genre" placeholder="Ex: Rock"
                     class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium text-neutral-300 mb-1">Tom</label>
              <input type="text" formControlName="key" placeholder="Ex: E, Am, D"
                     class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-neutral-300 mb-1">BPM</label>
              <input type="number" formControlName="bpm" placeholder="Ex: 120" min="1"
                     class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
              @if (form.controls.bpm.invalid && form.controls.bpm.touched) {
                <span class="text-xs text-red-500 mt-1 block">BPM deve ser um número positivo.</span>
              }
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium text-neutral-300 mb-1">Afinação</label>
              <select formControlName="tuning"
                      class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
                <option value="">Selecionar</option>
                @for (option of tuningOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-2">Status</label>
            <div class="grid grid-cols-3 gap-2">
              @for (option of statusOptions; track option.value) {
                <button type="button" (click)="form.controls.status.setValue(option.value)"
                        [class]="statusButtonClasses(option.value)">
                  {{ option.label }}
                </button>
              }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1">Tags</label>
            <input type="text" formControlName="tags" placeholder="Ex: cover, autoral, set principal"
                   class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
            <span class="text-xs text-neutral-500 mt-1 block">Separe por vírgula</span>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" (click)="cancel.emit()"
                    class="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.controls.title.invalid"
                    class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg font-medium transition-colors">
              Salvar Música
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SongFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() song: Song | null = null;
  @Output() save = new EventEmitter<SongPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly tuningOptions = ['Standard', 'Drop D', 'Meio tom abaixo', 'Um tom abaixo', 'DADGAD'];
  readonly statusOptions: { value: SongStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Ativa' },
    { value: 'REHEARSAL', label: 'Em ensaio' },
    { value: 'SUGGESTION', label: 'Sugestão' },
  ];

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    artist: [''],
    genre: [''],
    key: [''],
    bpm: this.fb.control<number | null>(null, Validators.min(1)),
    tuning: [''],
    status: this.fb.nonNullable.control<SongStatus>('ACTIVE'),
    tags: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['song']) {
      if (this.song) {
        this.form.patchValue({
          title: this.song.title,
          artist: this.song.artist ?? '',
          genre: this.song.genre ?? '',
          key: this.song.key ?? '',
          bpm: this.song.bpm ?? null,
          tuning: this.song.tuning ?? '',
          status: this.song.status,
          tags: this.song.tags ?? '',
        });
      } else {
        this.form.reset({
          title: '',
          artist: '',
          genre: '',
          key: '',
          bpm: null,
          tuning: '',
          status: 'ACTIVE',
          tags: '',
        });
      }
    }
  }

  statusButtonClasses(value: SongStatus): string {
    const base = 'text-sm px-3 py-2 rounded-lg border font-medium transition-colors';
    const selected = this.form.controls.status.value === value;
    if (!selected) {
      return `${base} border-neutral-800 text-neutral-400 hover:border-neutral-700`;
    }
    if (value === 'ACTIVE') return `${base} border-green-500 text-green-400 bg-green-500/10`;
    if (value === 'REHEARSAL') return `${base} border-amber-500 text-amber-400 bg-amber-500/10`;
    return `${base} border-purple-500 text-purple-400 bg-purple-500/10`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.save.emit({
      title: raw.title.trim(),
      artist: raw.artist?.trim() || null,
      genre: raw.genre?.trim() || null,
      key: raw.key?.trim() || null,
      bpm: raw.bpm ?? null,
      tuning: raw.tuning?.trim() || null,
      status: raw.status,
      tags: raw.tags?.trim() || null,
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
