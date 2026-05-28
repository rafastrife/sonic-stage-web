import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Band {
  id: number;
  name: string;
  genre?: string;
  bio?: string;
  created_at: string;
}

export interface DashboardMetrics {
  next_event: any | null;
  metrics: any;
  recent_setlists: any[];
}

@Injectable({ providedIn: 'root' })
export class BandStore {
  private http = inject(HttpClient);

  // State
  private readonly _activeBandId = signal<number | null>(null);
  private readonly _userBands = signal<Band[]>([]);
  private readonly _dashboardData = signal<DashboardMetrics | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  // Selectors
  readonly activeBandId = computed(() => this._activeBandId());
  readonly activeBand = computed(() => this._userBands().find(b => b.id === this._activeBandId()) || null);
  readonly userBands = computed(() => this._userBands());
  readonly dashboardData = computed(() => this._dashboardData());
  readonly isLoading = computed(() => this._isLoading());

  constructor() {
    this.loadUserBands();
  }

  // Actions
  loadUserBands() {
    this.http.get<Band[]>('/api/bands/').subscribe({
      next: (bands) => {
        this._userBands.set(bands);
        // Auto-select first band if none selected
        if (!this._activeBandId() && bands.length > 0) {
          this.setActiveBand(bands[0].id);
        }
      },
      error: (err) => console.error('Failed to load bands', err)
    });
  }

  setActiveBand(bandId: number) {
    this._activeBandId.set(bandId);
    this.loadDashboardData(bandId);
  }

  refreshDashboard() {
    const bandId = this._activeBandId();
    if (bandId) {
      this.loadDashboardData(bandId);
    }
  }

  private loadDashboardData(bandId: number) {
    this._isLoading.set(true);
    this.http.get<DashboardMetrics>(`/api/bands/${bandId}/dashboard/`).pipe(
      tap(data => {
        this._dashboardData.set(data);
        this._isLoading.set(false);
      }),
      catchError(err => {
        console.error('Failed to load dashboard data', err);
        this._isLoading.set(false);
        this._dashboardData.set(null);
        return of(null);
      })
    ).subscribe();
  }

  createBand(data: any) {
    return this.http.post<Band>('/api/bands/', data).pipe(
      tap((newBand) => {
        this._userBands.update(bands => [...bands, newBand]);
        this.setActiveBand(newBand.id);
      })
    );
  }
}
