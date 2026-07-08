import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsStore } from '../core/stores/notifications.store';
import { BandStore } from '../core/stores/band.store';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button (click)="toggle($event)" class="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors" aria-label="Notificações">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if (store.unreadCount() > 0) {
          <span class="absolute -top-0.5 -right-0.5 bg-neon-pink text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {{ store.unreadCount() }}
          </span>
        }
      </button>

      @if (open()) {
        <div class="absolute right-0 mt-2 w-96 max-h-[28rem] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <h3 class="text-white font-bold">
              Notificações
              @if (store.unreadCount() > 0) {
                <span class="text-neon-pink text-sm font-medium ml-1">{{ store.unreadCount() }} novas</span>
              }
            </h3>
            <button (click)="markAllRead()" class="text-xs text-neon-cyan hover:underline">Marcar tudo como lido</button>
          </div>

          @if (store.notifications().length === 0) {
            <div class="p-6 text-sm text-neutral-500 text-center">Nenhuma notificação por aqui.</div>
          } @else {
            @for (n of store.notifications(); track n.id) {
              <div class="px-4 py-3 border-b border-neutral-800 last:border-0" [class.bg-neutral-800]="!n.is_read">
                <div class="flex gap-3">
                  <div class="w-9 h-9 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-bold text-sm shrink-0">
                    {{ (n.actor?.display_name || '?')[0] }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-white">
                      <span class="font-bold">{{ n.actor?.display_name || 'Alguém' }}</span>
                      {{ messageFor(n) }}
                      <span class="text-neon-cyan font-medium">{{ n.band_name }}</span>
                    </p>
                    <p class="text-xs text-neutral-500 mt-0.5">{{ timeAgo(n.created_at) }}</p>

                    @if (n.notif_type === 'INVITE_RECEIVED' && n.invitation_status === 'PENDING') {
                      <div class="flex gap-2 mt-2">
                        <button (click)="accept(n)" class="bg-neon-cyan hover:bg-cyan-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Aceitar</button>
                        <button (click)="decline(n)" class="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Recusar</button>
                      </div>
                    } @else if (n.notif_type === 'INVITE_RECEIVED') {
                      <span class="inline-block mt-2 text-xs text-neutral-500">
                        {{ n.invitation_status === 'ACCEPTED' ? '✓ Convite aceito' : n.invitation_status === 'DECLINED' ? 'Convite recusado' : 'Convite não está mais disponível' }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `
})
export class NotificationBellComponent {
  store = inject(NotificationsStore);
  private bandStore = inject(BandStore);

  open = signal(false);

  @HostListener('document:click')
  closeOnOutsideClick() {
    this.open.set(false);
  }

  toggle(event: MouseEvent) {
    event.stopPropagation();
    this.open.update(v => !v);
  }

  markAllRead() {
    this.store.markAllRead().subscribe();
  }

  accept(n: any) {
    if (!n.invitation_id) return;
    this.store.acceptInvitation(n.invitation_id).subscribe(() => this.bandStore.loadUserBands());
  }

  decline(n: any) {
    if (!n.invitation_id) return;
    this.store.declineInvitation(n.invitation_id).subscribe();
  }

  messageFor(n: any): string {
    switch (n.notif_type) {
      case 'INVITE_RECEIVED':
        return 'te convidou para integrar a banda';
      case 'INVITE_ACCEPTED':
        return 'aceitou seu convite para';
      case 'INVITE_DECLINED':
        return 'recusou seu convite para';
      default:
        return '';
    }
  }

  timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  }
}
