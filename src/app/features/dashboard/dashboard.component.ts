import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBannerComponent } from './components/event-banner.component';
import { MetricsCardsComponent } from './components/metrics-cards.component';
import { RecentSetlistsComponent } from './components/recent-setlists.component';
import { BandStore } from '../../core/stores/band.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EventBannerComponent, MetricsCardsComponent, RecentSetlistsComponent],
  template: `
    <div class="p-8 h-full bg-[#111111] min-h-screen">
      
      <!-- Loading State -->
      <div *ngIf="bandStore.isLoading()" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>

      <!-- No Band State -->
      <div *ngIf="!bandStore.isLoading() && !bandStore.activeBandId()" class="flex flex-col justify-center items-center h-64 text-center">
        <h2 class="text-2xl font-bold text-white mb-2">Bem-vindo ao Sonic Stage!</h2>
        <p class="text-neutral-400 mb-6">Para começar, crie sua primeira banda.</p>
        <button class="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-2.5 rounded-full font-bold transition-colors">
          Criar Banda
        </button>
      </div>

      <!-- Main Content Grid -->
      <ng-container *ngIf="!bandStore.isLoading() && bandStore.activeBandId() && bandStore.dashboardData() as data">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Left Column (Event Banner) -->
          <div class="xl:col-span-2">
            <app-event-banner [event]="data.next_event"></app-event-banner>
          </div>
          
          <!-- Right Column (Metrics Cards) -->
          <div class="xl:col-span-1">
            <app-metrics-cards [metrics]="data.metrics"></app-metrics-cards>
          </div>
        </div>

        <!-- Bottom Row (Recent Setlists) -->
        <app-recent-setlists [setlists]="data.recent_setlists"></app-recent-setlists>
      </ng-container>
      
    </div>
  `
})
export class DashboardComponent {
  bandStore = inject(BandStore);
}
