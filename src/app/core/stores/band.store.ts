import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BandStore {
  private http = inject(HttpClient);

  // State
  private readonly _bands = signal<any[]>([]);
  private readonly _activeBand = signal<any | null>(null);

  // Selectors
  readonly bands = computed(() => this._bands());
  readonly activeBand = computed(() => this._activeBand());

  // Actions
  loadBands() {
    return this.http.get<any[]>('/api/bands/').pipe(
      tap(bands => {
        this._bands.set(bands);
        if (bands.length > 0 && !this._activeBand()) {
          this._activeBand.set(bands[0]);
        }
      })
    );
  }

  setActiveBand(band: any) {
    this._activeBand.set(band);
  }

  createBand(data: any) {
    return this.http.post<any>('/api/bands/', data).pipe(
      tap(newBand => {
        this._bands.update(bands => [...bands, newBand]);
        this.setActiveBand(newBand);
      })
    );
  }
}
