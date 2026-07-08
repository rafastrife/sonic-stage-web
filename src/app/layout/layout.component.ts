import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NotificationBellComponent } from './notification-bell.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NotificationBellComponent],
  template: `
    <div class="flex h-screen bg-[#111111] overflow-hidden text-white">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 shrink-0 border-b border-neutral-800 flex items-center justify-end px-6">
          <app-notification-bell></app-notification-bell>
        </header>
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {}
