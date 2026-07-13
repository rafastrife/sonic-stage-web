import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BandStore } from '../../core/stores/band.store';
import { SongService } from '../../services/song.service';
import { SetlistService } from '../../services/setlist.service';
import { Song, SongPayload, SongStatus, SONG_STATUS_LABELS } from '../../models/song.model';
import { Setlist, SetlistPayload, SetlistStatus, SETLIST_STATUS_LABELS } from '../../models/setlist.model';
import { SongFormComponent } from './song-form/song-form.component';
import { SetlistFormComponent } from './setlist-form/setlist-form.component';

type StatusFilter = SongStatus | null;

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [CommonModule, SongFormComponent, SetlistFormComponent],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Repertório</h1>
          <p class="text-neutral-400 mt-1">Gerencie as músicas e crie setlists da sua banda.</p>
        </div>
        <button (click)="isExportModalOpen.set(true)" class="bg-neon-cyan hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-neon-cyan/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
          Exportar PDF
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button (click)="activeTab.set('musicas')" [class]="tabClasses('musicas')">Músicas</button>
        <button (click)="activeTab.set('setlists')" [class]="tabClasses('setlists')">Setlists</button>
      </div>

      @if (activeTab() === 'musicas') {
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <div class="relative flex-1">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>
            <input type="text" [value]="searchTerm()" (input)="searchTerm.set($any($event.target).value)"
                   placeholder="Buscar músicas..."
                   class="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-neon-cyan">
          </div>
          <button (click)="isFiltersOpen.set(!isFiltersOpen())"
                  class="bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-xl px-4 py-2.5 text-white font-medium flex items-center gap-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M6 8h12M10 12h4M12 16v4"></path></svg>
            Filtros
          </button>
          <button (click)="openCreateForm()" [disabled]="!hasActiveBand()"
                  class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
            + Nova Música
          </button>
        </div>

        @if (isFiltersOpen()) {
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 mb-4">
            <div class="mb-3">
              <span class="text-xs font-medium text-neutral-400 uppercase tracking-wide">Gênero</span>
              <select [value]="genreFilter()" (change)="genreFilter.set($any($event.target).value)"
                      class="mt-1 w-full sm:w-64 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white outline-none">
                <option value="">Todos os gêneros</option>
                @for (genre of genreOptions(); track genre) {
                  <option [value]="genre">{{ genre }}</option>
                }
              </select>
            </div>
          </div>
        }

        <!-- Status counters / quick filters -->
        <div class="flex flex-wrap gap-3 mb-6">
          @for (option of statusOptions; track option.value) {
            <button (click)="toggleStatusFilter(option.value)" [class]="statusChipClasses(option.value)">
              <span class="w-1.5 h-1.5 rounded-full" [class]="statusDotClasses(option.value)"></span>
              {{ statusCounts()[option.value] || 0 }} {{ option.chipLabel }}
            </button>
          }
        </div>

        @if (!hasActiveBand()) {
          <div class="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p class="text-neutral-500">Carregando banda...</p>
          </div>
        } @else if (filteredSongs().length === 0) {
          <div class="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p class="text-neutral-500">
              @if (songs().length === 0) {
                Nenhuma música cadastrada ainda. Clique em "Nova Música" para começar.
              } @else {
                Nenhuma música encontrada para os filtros atuais.
              }
            </p>
          </div>
        } @else {
          <div class="space-y-2">
            @for (song of filteredSongs(); track song.id; let i = $index) {
              <div class="bg-neutral-900/40 border border-neutral-800/50 rounded-xl p-4 flex items-center gap-4 hover:bg-neutral-800/60 transition-colors"
                   draggable="true"
                   (dragstart)="onDragStart(song)"
                   (dragover)="$event.preventDefault()"
                   (drop)="onDrop(song)">
                <span class="cursor-grab text-neutral-600 select-none" title="Arraste para reordenar">⠿</span>
                <span class="text-neutral-600 font-mono text-sm w-6">{{ (i + 1).toString().padStart(2, '0') }}</span>

                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-white truncate">{{ song.title }}</h4>
                  <p class="text-xs text-neutral-500 truncate">
                    {{ song.genre || '—' }} <span *ngIf="song.artist">• {{ song.artist }}</span>
                  </p>
                  @if (song.tags) {
                    <div class="flex flex-wrap gap-1 mt-1.5">
                      @for (tag of parseTags(song.tags); track tag) {
                        <span class="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded">{{ tag }}</span>
                      }
                    </div>
                  }
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  @if (song.spotify_url) {
                    <a [href]="song.spotify_url" target="_blank" rel="noopener noreferrer"
                       class="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium hover:bg-green-500/20 transition-colors"
                       title="Ouvir no Spotify">♫ Spotify</a>
                  }
                  @if (song.key) {
                    <span class="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-md text-xs font-medium">{{ song.key }}</span>
                  }
                  @if (song.bpm) {
                    <span class="px-2 py-1 bg-neutral-800 text-neutral-300 rounded-md text-xs font-medium">{{ song.bpm }} BPM</span>
                  }

                  <select (change)="changeStatus(song, $any($event.target).value)"
                          [class]="statusSelectClasses(song.status)">
                    @for (option of statusOptions; track option.value) {
                      <option [value]="option.value" [selected]="option.value === song.status">{{ option.label }}</option>
                    }
                  </select>

                  <div class="relative">
                    <button (click)="openMenuSongId.set(openMenuSongId() === song.id ? null : song.id)"
                            class="text-neutral-500 hover:text-white px-2 py-1" aria-label="Mais ações">⋮</button>
                    @if (openMenuSongId() === song.id) {
                      <div class="absolute right-0 mt-1 w-32 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-10 overflow-hidden">
                        <button (click)="openEditForm(song)" class="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800">Editar</button>
                        <button (click)="requestDelete(song)" class="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800">Excluir</button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <!-- Setlists tab -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <div class="relative flex-1">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>
            <input type="text" [value]="setlistSearchTerm()" (input)="setlistSearchTerm.set($any($event.target).value)"
                   placeholder="Buscar setlists..."
                   class="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-neon-cyan">
          </div>
          <button (click)="openCreateSetlistForm()" [disabled]="!hasActiveBand()"
                  class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
            + Nova Setlist
          </button>
        </div>

        @if (!hasActiveBand()) {
          <div class="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p class="text-neutral-500">Carregando banda...</p>
          </div>
        } @else if (filteredSetlists().length === 0) {
          <div class="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p class="text-neutral-500">
              @if (setlists().length === 0) {
                Nenhuma setlist ainda. Clique em "Nova Setlist" para começar.
              } @else {
                Nenhuma setlist encontrada para a busca atual.
              }
            </p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (setlist of filteredSetlists(); track setlist.id) {
              <div class="bg-gradient-to-br from-neon-cyan/5 to-neon-pink/5 border border-neon-cyan/20 rounded-2xl p-5">
                <div class="flex items-start justify-between mb-2">
                  <div class="min-w-0">
                    <h3 class="font-bold text-lg text-white truncate">{{ setlist.name }}</h3>
                    <p class="text-xs text-neutral-500 mt-0.5">Criada em {{ setlist.created_at | date:'d MMM yyyy' }}</p>
                  </div>
                  <div class="relative shrink-0">
                    <div class="flex items-center gap-2">
                      <span [class]="setlistStatusBadgeClasses(setlist.status)">● {{ setlistStatusLabel(setlist.status) }}</span>
                      <button (click)="openSetlistMenuId.set(openSetlistMenuId() === setlist.id ? null : setlist.id)"
                              class="text-neutral-500 hover:text-white px-1" aria-label="Mais ações">⋮</button>
                    </div>
                    @if (openSetlistMenuId() === setlist.id) {
                      <div class="absolute right-0 mt-1 w-40 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-10 overflow-hidden">
                        <button (click)="toggleSetlistStatus(setlist)" class="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800">
                          {{ setlist.status === 'READY' ? 'Marcar como rascunho' : 'Marcar como pronta' }}
                        </button>
                        <button (click)="requestDeleteSetlist(setlist)" class="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800">Excluir</button>
                      </div>
                    }
                  </div>
                </div>

                <p class="text-xs text-neutral-500 flex items-center gap-3 mb-4">
                  <span>♪ {{ setlist.songs.length }} música{{ setlist.songs.length === 1 ? '' : 's' }}</span>
                  <span>⏱ ~{{ formatSetlistDuration(setlist) }}</span>
                </p>

                <div class="space-y-1 mb-4">
                  @for (rel of previewSongs(setlist); track rel.id; let i = $index) {
                    <div class="text-sm text-neutral-300 flex items-center justify-between gap-2">
                      <span class="truncate"><span class="text-neutral-600 font-mono mr-2">{{ i + 1 }}</span>{{ rel.song.title }}</span>
                    </div>
                  }
                  @if (setlist.songs.length > 3) {
                    <p class="text-xs text-neutral-600">+{{ setlist.songs.length - 3 }} música{{ setlist.songs.length - 3 === 1 ? '' : 's' }}</p>
                  }
                  @if (setlist.songs.length === 0) {
                    <p class="text-sm text-neutral-600">Nenhuma música adicionada ainda.</p>
                  }
                </div>

                <div class="flex gap-2">
                  <button (click)="openEditSetlistForm(setlist)" class="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">Editar</button>
                  <button (click)="requestSetlistExport(setlist)" class="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">Compartilhar</button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>

    <!-- Song form modal -->
    @if (isFormOpen()) {
      <app-song-form [song]="editingSong()" (save)="submitForm($event)" (cancel)="closeForm()" />
    }

    <!-- Setlist form modal -->
    @if (isSetlistFormOpen()) {
      <app-setlist-form [setlist]="editingSetlist()" [repertoire]="songs()" (save)="submitSetlistForm($event)" (cancel)="closeSetlistForm()" />
    }

    <!-- Setlist delete confirmation -->
    @if (deleteSetlistTarget(); as target) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Excluir "{{ target.name }}"?</h3>
          <p class="text-sm text-neutral-400 mb-6">Esta ação não pode ser desfeita. As músicas do repertório não serão afetadas.</p>
          <div class="flex justify-end gap-3">
            <button (click)="cancelDeleteSetlist()" class="text-neutral-400 hover:text-white px-4 py-2 font-medium transition-colors">Cancelar</button>
            <button (click)="confirmDeleteSetlist()" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Excluir</button>
          </div>
        </div>
      </div>
    }

    <!-- Setlist export modal -->
    @if (setlistExportTarget(); as target) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Exportar "{{ target.name }}"</h3>
          @if (target.songs.length === 0) {
            <p class="text-sm text-amber-400 mb-6">Esta setlist não tem músicas. Adicione ao menos uma música antes de exportar.</p>
            <div class="flex justify-end">
              <button (click)="setlistExportTarget.set(null)" class="text-neutral-400 hover:text-white px-4 py-2 font-medium transition-colors">Fechar</button>
            </div>
          } @else {
            <p class="text-sm text-neutral-400 mb-6">Escolha o tema visual do PDF gerado.</p>
            <div class="space-y-3">
              <button (click)="exportSetlistToPDF('dark')" class="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all text-left">
                <div>
                  <div class="text-white font-medium">Tema Escuro</div>
                  <div class="text-xs text-neutral-500">Ideal para palcos (baixo reflexo)</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800"></div>
              </button>
              <button (click)="exportSetlistToPDF('light')" class="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:border-pink-500 hover:bg-pink-500/10 transition-all text-left">
                <div>
                  <div class="text-white font-medium">Tema Claro</div>
                  <div class="text-xs text-neutral-500">Ideal para impressão em papel</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-white border border-neutral-200"></div>
              </button>
            </div>
            <div class="mt-6 flex justify-end">
              <button (click)="setlistExportTarget.set(null)" class="text-neutral-400 hover:text-white px-4 py-2 font-medium transition-colors">Cancelar</button>
            </div>
          }
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (deleteTarget(); as target) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Excluir "{{ target.title }}"?</h3>
          @if (deleteUsages().length > 0) {
            <p class="text-sm text-amber-400 mb-4">
              Esta música está nos setlists: {{ setlistNames(deleteUsages()) }}. Removê-la também a tirará desses setlists.
            </p>
          } @else {
            <p class="text-sm text-neutral-400 mb-6">Esta ação não pode ser desfeita.</p>
          }
          <div class="flex justify-end gap-3">
            <button (click)="cancelDelete()" class="text-neutral-400 hover:text-white px-4 py-2 font-medium transition-colors">Cancelar</button>
            <button (click)="confirmDelete()" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Excluir</button>
          </div>
        </div>
      </div>
    }

    <!-- Export Modal -->
    @if (isExportModalOpen()) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-2">Exportar Repertório</h3>
          <p class="text-sm text-neutral-400 mb-6">Escolha o tema visual do PDF gerado.</p>

          <div class="space-y-3">
            <button (click)="exportToPDF('dark')" class="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all text-left">
              <div>
                <div class="text-white font-medium">Tema Escuro</div>
                <div class="text-xs text-neutral-500">Ideal para palcos (baixo reflexo)</div>
              </div>
              <div class="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800"></div>
            </button>

            <button (click)="exportToPDF('light')" class="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:border-pink-500 hover:bg-pink-500/10 transition-all text-left">
              <div>
                <div class="text-white font-medium">Tema Claro</div>
                <div class="text-xs text-neutral-500">Ideal para impressão em papel</div>
              </div>
              <div class="w-8 h-8 rounded-full bg-white border border-neutral-200"></div>
            </button>
          </div>

          <div class="mt-6 flex justify-end">
            <button (click)="isExportModalOpen.set(false)" class="text-neutral-400 hover:text-white px-4 py-2 font-medium transition-colors">Cancelar</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class RepertoireComponent {
  bandStore = inject(BandStore);
  private http = inject(HttpClient);
  private songService = inject(SongService);
  private setlistService = inject(SetlistService);

  songs = signal<Song[]>([]);
  setlists = signal<Setlist[]>([]);

  activeTab = signal<'musicas' | 'setlists'>('musicas');
  searchTerm = signal('');
  statusFilter = signal<StatusFilter>(null);
  genreFilter = signal('');
  isFiltersOpen = signal(false);

  isFormOpen = signal(false);
  editingSong = signal<Song | null>(null);
  openMenuSongId = signal<number | null>(null);

  deleteTarget = signal<Song | null>(null);
  deleteUsages = signal<{ id: number; name: string }[]>([]);

  isExportModalOpen = signal(false);

  private draggedSongId = signal<number | null>(null);

  setlistSearchTerm = signal('');
  isSetlistFormOpen = signal(false);
  editingSetlist = signal<Setlist | null>(null);
  openSetlistMenuId = signal<number | null>(null);
  deleteSetlistTarget = signal<Setlist | null>(null);
  setlistExportTarget = signal<Setlist | null>(null);

  readonly statusOptions: { value: SongStatus; label: string; chipLabel: string }[] = [
    { value: 'ACTIVE', label: 'Ativa', chipLabel: 'ativas' },
    { value: 'REHEARSAL', label: 'Em ensaio', chipLabel: 'em ensaio' },
    { value: 'SUGGESTION', label: 'Sugestão', chipLabel: 'sugestão' },
  ];

  hasActiveBand = computed(() => !!this.bandStore.activeBand());

  statusCounts = computed<Record<SongStatus, number>>(() => {
    const counts: Record<SongStatus, number> = { ACTIVE: 0, REHEARSAL: 0, SUGGESTION: 0 };
    for (const song of this.songs()) {
      counts[song.status] = (counts[song.status] || 0) + 1;
    }
    return counts;
  });

  genreOptions = computed(() => {
    const genres = new Set<string>();
    for (const song of this.songs()) {
      if (song.genre) genres.add(song.genre);
    }
    return Array.from(genres).sort();
  });

  filteredSongs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const genre = this.genreFilter();
    return this.songs().filter((song) => {
      const matchesTerm =
        !term ||
        song.title.toLowerCase().includes(term) ||
        (song.artist || '').toLowerCase().includes(term);
      const matchesStatus = !status || song.status === status;
      const matchesGenre = !genre || song.genre === genre;
      return matchesTerm && matchesStatus && matchesGenre;
    });
  });

  filteredSetlists = computed(() => {
    const term = this.setlistSearchTerm().trim().toLowerCase();
    if (!term) return this.setlists();
    return this.setlists().filter((setlist) => setlist.name.toLowerCase().includes(term));
  });

  constructor() {
    effect(
      () => {
        const band = this.bandStore.activeBand();
        if (band) {
          this.loadData(band.id);
        } else {
          this.songs.set([]);
          this.setlists.set([]);
        }
      },
      { allowSignalWrites: true }
    );
  }

  loadData(bandId: number): void {
    this.songService.list(bandId).subscribe((data) => this.songs.set(data));
    this.setlistService.list(bandId).subscribe((data) => this.setlists.set(data));
  }

  tabClasses(tab: 'musicas' | 'setlists'): string {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors';
    return this.activeTab() === tab
      ? `${base} bg-neon-cyan text-black`
      : `${base} bg-neutral-900/60 text-neutral-400 hover:text-white`;
  }

  statusDotClasses(status: SongStatus): string {
    if (status === 'ACTIVE') return 'bg-green-400';
    if (status === 'REHEARSAL') return 'bg-amber-400';
    return 'bg-purple-400';
  }

  statusChipClasses(status: SongStatus): string {
    const base = 'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors';
    const active = this.statusFilter() === status;
    if (status === 'ACTIVE') {
      return `${base} ${active ? 'bg-green-500/20 border-green-500' : 'bg-green-500/10 border-transparent'} text-green-400`;
    }
    if (status === 'REHEARSAL') {
      return `${base} ${active ? 'bg-amber-500/20 border-amber-500' : 'bg-amber-500/10 border-transparent'} text-amber-400`;
    }
    return `${base} ${active ? 'bg-purple-500/20 border-purple-500' : 'bg-purple-500/10 border-transparent'} text-purple-400`;
  }

  statusSelectClasses(status: SongStatus): string {
    const base = 'text-xs font-medium rounded-md px-2 py-1 border-0 outline-none cursor-pointer';
    if (status === 'ACTIVE') return `${base} bg-green-500/10 text-green-400`;
    if (status === 'REHEARSAL') return `${base} bg-amber-500/10 text-amber-400`;
    return `${base} bg-purple-500/10 text-purple-400`;
  }

  toggleStatusFilter(status: SongStatus): void {
    this.statusFilter.set(this.statusFilter() === status ? null : status);
  }

  parseTags(tags: string): string[] {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  openCreateForm(): void {
    this.editingSong.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(song: Song): void {
    this.openMenuSongId.set(null);
    this.editingSong.set(song);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingSong.set(null);
  }

  submitForm(payload: SongPayload): void {
    const band = this.bandStore.activeBand();
    if (!band) return;

    const editing = this.editingSong();
    const request = editing
      ? this.songService.update(band.id, editing.id, payload)
      : this.songService.create(band.id, payload);

    request.subscribe(() => {
      this.closeForm();
      this.loadData(band.id);
    });
  }

  changeStatus(song: Song, status: SongStatus): void {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.songService.update(band.id, song.id, { status }).subscribe((updated) => {
      this.songs.update((current) => current.map((s) => (s.id === song.id ? updated : s)));
    });
  }

  requestDelete(song: Song): void {
    this.openMenuSongId.set(null);
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.deleteTarget.set(song);
    this.deleteUsages.set([]);
    this.songService.usages(band.id, song.id).subscribe((usages) => this.deleteUsages.set(usages));
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
    this.deleteUsages.set([]);
  }

  confirmDelete(): void {
    const band = this.bandStore.activeBand();
    const song = this.deleteTarget();
    if (!band || !song) return;
    this.songService.delete(band.id, song.id).subscribe(() => {
      this.deleteTarget.set(null);
      this.deleteUsages.set([]);
      this.loadData(band.id);
    });
  }

  setlistNames(usages: { id: number; name: string }[]): string {
    return usages.map((u) => u.name).join(', ');
  }

  onDragStart(song: Song): void {
    this.draggedSongId.set(song.id);
  }

  onDrop(targetSong: Song): void {
    const band = this.bandStore.activeBand();
    const draggedId = this.draggedSongId();
    this.draggedSongId.set(null);
    if (!band || draggedId === null || draggedId === targetSong.id) return;

    const current = [...this.songs()];
    const fromIndex = current.findIndex((s) => s.id === draggedId);
    const toIndex = current.findIndex((s) => s.id === targetSong.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    this.songs.set(current);

    this.songService.reorder(band.id, current.map((s) => s.id)).subscribe();
  }

  exportToPDF(theme: 'dark' | 'light'): void {
    const band = this.bandStore.activeBand();
    if (!band) return;

    this.isExportModalOpen.set(false);
    const url = `/api/bands/${band.id}/generate_repertoire_pdf/?theme=${theme}`;

    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `repertorio-${band.name.toLowerCase().replace(/\s+/g, '-')}-${theme}.pdf`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    });
  }

  setlistStatusLabel(status: SetlistStatus): string {
    return SETLIST_STATUS_LABELS[status];
  }

  setlistStatusBadgeClasses(status: SetlistStatus): string {
    const base = 'text-xs font-medium px-2 py-1 rounded-full';
    return status === 'READY'
      ? `${base} bg-green-500/10 text-green-400`
      : `${base} bg-amber-500/10 text-amber-400`;
  }

  previewSongs(setlist: Setlist) {
    return [...setlist.songs].sort((a, b) => a.order_index - b.order_index).slice(0, 3);
  }

  formatSetlistDuration(setlist: Setlist): string {
    const totalSeconds = setlist.songs.reduce((sum, rel) => sum + (rel.song.duration_seconds || 0), 0);
    const m = Math.floor(totalSeconds / 60);
    const s = Math.round(totalSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  openCreateSetlistForm(): void {
    this.editingSetlist.set(null);
    this.isSetlistFormOpen.set(true);
  }

  openEditSetlistForm(setlist: Setlist): void {
    this.openSetlistMenuId.set(null);
    this.editingSetlist.set(setlist);
    this.isSetlistFormOpen.set(true);
  }

  closeSetlistForm(): void {
    this.isSetlistFormOpen.set(false);
    this.editingSetlist.set(null);
  }

  submitSetlistForm(payload: SetlistPayload): void {
    const band = this.bandStore.activeBand();
    if (!band) return;

    const editing = this.editingSetlist();
    const request = editing
      ? this.setlistService.update(band.id, editing.id, payload)
      : this.setlistService.create(band.id, { ...payload, status: 'DRAFT' });

    request.subscribe(() => {
      this.closeSetlistForm();
      this.loadData(band.id);
    });
  }

  toggleSetlistStatus(setlist: Setlist): void {
    this.openSetlistMenuId.set(null);
    const band = this.bandStore.activeBand();
    if (!band) return;
    const status: SetlistStatus = setlist.status === 'READY' ? 'DRAFT' : 'READY';
    this.setlistService.update(band.id, setlist.id, { status }).subscribe((updated) => {
      this.setlists.update((current) => current.map((s) => (s.id === setlist.id ? updated : s)));
    });
  }

  requestDeleteSetlist(setlist: Setlist): void {
    this.openSetlistMenuId.set(null);
    this.deleteSetlistTarget.set(setlist);
  }

  cancelDeleteSetlist(): void {
    this.deleteSetlistTarget.set(null);
  }

  confirmDeleteSetlist(): void {
    const band = this.bandStore.activeBand();
    const setlist = this.deleteSetlistTarget();
    if (!band || !setlist) return;
    this.setlistService.delete(band.id, setlist.id).subscribe(() => {
      this.deleteSetlistTarget.set(null);
      this.loadData(band.id);
    });
  }

  requestSetlistExport(setlist: Setlist): void {
    this.openSetlistMenuId.set(null);
    this.setlistExportTarget.set(setlist);
  }

  exportSetlistToPDF(theme: 'dark' | 'light'): void {
    const band = this.bandStore.activeBand();
    const setlist = this.setlistExportTarget();
    if (!band || !setlist) return;

    this.setlistExportTarget.set(null);
    this.setlistService.exportPdf(band.id, setlist.id, theme).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `setlist-${setlist.name.toLowerCase().replace(/\s+/g, '-')}-${theme}.pdf`;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: () => alert('Não foi possível gerar o PDF da setlist. Tente novamente.'),
    });
  }
}
