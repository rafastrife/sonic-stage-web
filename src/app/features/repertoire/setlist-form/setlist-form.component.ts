import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Song } from '../../../models/song.model';
import { Setlist, SetlistPayload } from '../../../models/setlist.model';

@Component({
  selector: 'app-setlist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-3xl shadow-2xl">
        <div class="flex items-start justify-between mb-1">
          <h3 class="text-xl font-bold text-white">{{ setlist ? 'Editar Setlist' : 'Nova Setlist' }}</h3>
          <button type="button" (click)="cancel.emit()" class="text-neutral-500 hover:text-white transition-colors" aria-label="Fechar">✕</button>
        </div>
        <p class="text-sm text-neutral-400 mb-6">Adicione músicas do repertório para montar a setlist.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-5">
            <label class="block text-sm font-medium text-neutral-300 mb-1">Nome da setlist *</label>
            <input type="text" formControlName="name" placeholder="Ex: Show Bar do Rock"
                   class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-cyan">
            @if (form.controls.name.invalid && form.controls.name.touched) {
              <span class="text-xs text-red-500 mt-1 block">O nome da setlist é obrigatório.</span>
            }
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Repertório</span>
              <div class="mt-2 border border-neutral-800 rounded-xl max-h-80 overflow-y-auto divide-y divide-neutral-800">
                @if (repertoire.length === 0) {
                  <div class="p-4 text-sm text-neutral-500">
                    Nenhuma música no repertório ainda. Cadastre músicas na aba "Músicas" primeiro.
                  </div>
                } @else {
                  @for (song of repertoire; track song.id) {
                    <div class="flex items-center justify-between gap-2 p-3">
                      <div class="min-w-0">
                        <div class="text-sm font-medium text-white truncate">{{ song.title }}</div>
                        <div class="text-xs text-neutral-500 truncate">
                          {{ song.artist || '—' }} · {{ formatDuration(song.duration_seconds) }}
                        </div>
                      </div>
                      @if (isSelected(song.id)) {
                        <span class="text-xs text-green-400 font-medium shrink-0">✓ Adicionada</span>
                      } @else {
                        <button type="button" (click)="addSong(song)" [attr.aria-label]="'Adicionar ' + song.title"
                                class="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-neon-cyan hover:bg-cyan-400 text-black font-bold">+</button>
                      }
                    </div>
                  }
                }
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Setlist</span>
                <span class="text-xs text-neutral-500">~{{ formatDuration(totalDurationSeconds()) }}</span>
              </div>
              <div class="mt-2 border border-neutral-800 rounded-xl max-h-80 overflow-y-auto divide-y divide-neutral-800">
                @if (selectedSongs().length === 0) {
                  <div class="p-4 text-sm text-neutral-500">
                    Clique em "+" nas músicas do repertório para adicioná-las.
                  </div>
                } @else {
                  @for (song of selectedSongs(); track song.id; let i = $index) {
                    <div class="flex items-center gap-2 p-3"
                         draggable="true"
                         (dragstart)="onDragStart(song.id)"
                         (dragover)="$event.preventDefault()"
                         (drop)="onDrop(song.id)">
                      <span class="cursor-grab text-neutral-600 select-none" title="Arraste para reordenar">⠿</span>
                      <span class="text-neutral-600 font-mono text-xs w-5">{{ i + 1 }}</span>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-white truncate">{{ song.title }}</div>
                        <div class="text-xs text-neutral-500">{{ formatDuration(song.duration_seconds) }}</div>
                      </div>
                      <button type="button" (click)="removeSong(song.id)" class="shrink-0 text-neutral-500 hover:text-red-400" aria-label="Remover">✕</button>
                    </div>
                  }
                }
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6">
            <button type="button" (click)="cancel.emit()"
                    class="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.controls.name.invalid"
                    class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg font-medium transition-colors">
              Salvar Setlist
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SetlistFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() setlist: Setlist | null = null;
  @Input() repertoire: Song[] = [];
  @Output() save = new EventEmitter<SetlistPayload>();
  @Output() cancel = new EventEmitter<void>();

  private selectedSongIds = signal<number[]>([]);
  private draggedSongId: number | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  selectedSongs = computed<Song[]>(() => {
    const byId = new Map(this.repertoire.map((s) => [s.id, s]));
    return this.selectedSongIds()
      .map((id) => byId.get(id))
      .filter((s): s is Song => !!s);
  });

  totalDurationSeconds = computed(() =>
    this.selectedSongs().reduce((sum, s) => sum + (s.duration_seconds || 0), 0)
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setlist']) {
      if (this.setlist) {
        this.form.patchValue({ name: this.setlist.name });
        this.selectedSongIds.set(
          [...this.setlist.songs].sort((a, b) => a.order_index - b.order_index).map((rel) => rel.song.id)
        );
      } else {
        this.form.reset({ name: '' });
        this.selectedSongIds.set([]);
      }
    }
  }

  isSelected(songId: number): boolean {
    return this.selectedSongIds().includes(songId);
  }

  addSong(song: Song): void {
    if (this.isSelected(song.id)) return;
    this.selectedSongIds.update((ids) => [...ids, song.id]);
  }

  removeSong(songId: number): void {
    this.selectedSongIds.update((ids) => ids.filter((id) => id !== songId));
  }

  onDragStart(songId: number): void {
    this.draggedSongId = songId;
  }

  onDrop(targetSongId: number): void {
    const draggedId = this.draggedSongId;
    this.draggedSongId = null;
    if (draggedId === null || draggedId === targetSongId) return;

    const ids = [...this.selectedSongIds()];
    const fromIndex = ids.indexOf(draggedId);
    const toIndex = ids.indexOf(targetSongId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, moved);
    this.selectedSongIds.set(ids);
  }

  formatDuration(seconds: number | null | undefined): string {
    if (!seconds && seconds !== 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit({
      name: this.form.getRawValue().name.trim(),
      song_ids: this.selectedSongIds(),
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
