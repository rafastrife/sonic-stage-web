import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BandStore } from '../../core/stores/band.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Repertório</h1>
          <p class="text-neutral-400 mt-1">Gerencie as músicas e crie setlists.</p>
        </div>
        <button (click)="exportToPDF()" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
          Exportar PDF
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Songs Column -->
        <div>
          <h2 class="text-xl font-bold mb-4 flex justify-between items-center">
            Músicas 
            <button (click)="isAddingSong = !isAddingSong" class="text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors">+ Nova Música</button>
          </h2>

          <div *ngIf="isAddingSong" class="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-4">
            <form [formGroup]="songForm" (ngSubmit)="addSong()" class="space-y-4">
              <input type="text" formControlName="title" placeholder="Título da música" class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none">
              <div class="flex gap-2">
                <input type="text" formControlName="genre" placeholder="Gênero" class="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none">
                <input type="text" formControlName="tuning" placeholder="Afinação" class="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none">
              </div>
              <button type="submit" [disabled]="songForm.invalid" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium">Salvar Música</button>
            </form>
          </div>

          <div class="space-y-2">
            <div *ngFor="let song of songs()" class="bg-neutral-900/40 border border-neutral-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors">
              <div>
                <h4 class="font-bold text-white">{{ song.title }}</h4>
                <p class="text-xs text-neutral-500">{{ song.genre }} • {{ song.tuning }}</p>
              </div>
              <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium">{{ song.status }}</span>
            </div>
          </div>
        </div>

        <!-- Setlists Column -->
        <div>
          <h2 class="text-xl font-bold mb-4">Setlists</h2>
          <div class="space-y-4">
            <div *ngFor="let setlist of setlists()" class="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-5">
              <h3 class="font-bold text-lg text-white mb-2">{{ setlist.name }}</h3>
              <p class="text-sm text-indigo-400 mb-4">{{ setlist.songs?.length || 0 }} músicas</p>
              <div class="space-y-1">
                <div *ngFor="let rel of setlist.songs; let i = index" class="text-sm text-neutral-300 flex items-center gap-2">
                  <span class="text-neutral-600 font-mono">{{ i + 1 }}.</span>
                  {{ rel.song.title }}
                </div>
              </div>
            </div>
            
            <div *ngIf="setlists().length === 0" class="text-center py-10 border border-dashed border-neutral-800 rounded-2xl">
              <p class="text-neutral-500">Nenhum setlist montado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RepertoireComponent {
  bandStore = inject(BandStore);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  songs = signal<any[]>([]);
  setlists = signal<any[]>([]);
  isAddingSong = false;

  songForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    genre: [''],
    tuning: [''],
    status: ['ACTIVE']
  });

  constructor() {
    effect(() => {
      const band = this.bandStore.activeBand();
      if (band) {
        this.loadData(band.id);
      } else {
        this.songs.set([]);
        this.setlists.set([]);
      }
    });
  }

  loadData(bandId: number) {
    this.http.get<any[]>(`/api/bands/${bandId}/songs/`).subscribe(data => this.songs.set(data));
    this.http.get<any[]>(`/api/bands/${bandId}/setlists/`).subscribe(data => this.setlists.set(data));
  }

  addSong() {
    const band = this.bandStore.activeBand();
    if (this.songForm.valid && band) {
      this.http.post(`/api/bands/${band.id}/songs/`, this.songForm.getRawValue()).subscribe(() => {
        this.isAddingSong = false;
        this.songForm.reset({status: 'ACTIVE'});
        this.loadData(band.id);
      });
    }
  }

  exportToPDF() {
    const band = this.bandStore.activeBand();
    if (!band) return;

    // TODO: Ideally provide a theme selection modal here.
    // For now, defaulting to dark theme to show the new layout.
    const theme = 'dark';
    const url = `/api/bands/${band.id}/generate_repertoire_pdf/?theme=${theme}`;
    
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `repertorio-${band.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    });
  }
}
