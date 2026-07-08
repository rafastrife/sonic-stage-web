import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface AppNotification {
  id: number;
  actor: { id: number; display_name: string; email: string } | null;
  band: number;
  band_name: string;
  invitation_id: number | null;
  invitation_status: string | null;
  notif_type: 'INVITE_RECEIVED' | 'INVITE_ACCEPTED' | 'INVITE_DECLINED';
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private http = inject(HttpClient);

  private readonly _notifications = signal<AppNotification[]>([]);

  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.is_read).length);

  constructor() {
    if (localStorage.getItem('access_token')) {
      this.loadNotifications();
    }
    window.addEventListener('auth:session-ready', () => {
      this.loadNotifications();
    });
  }

  loadNotifications() {
    this.http.get<AppNotification[]>('/api/notifications/').pipe(
      catchError(err => {
        console.error('Failed to load notifications', err);
        return of([] as AppNotification[]);
      })
    ).subscribe(notifications => this._notifications.set(notifications));
  }

  markRead(id: number) {
    return this.http.post(`/api/notifications/${id}/read/`, {}).pipe(
      tap(() => {
        this._notifications.update(list =>
          list.map(n => (n.id === id ? { ...n, is_read: true } : n))
        );
      })
    );
  }

  markAllRead() {
    return this.http.post('/api/notifications/mark-all-read/', {}).pipe(
      tap(() => {
        this._notifications.update(list => list.map(n => ({ ...n, is_read: true })));
      })
    );
  }

  acceptInvitation(invitationId: number) {
    return this.http.post(`/api/invitations/${invitationId}/accept/`, {}).pipe(
      tap(() => this.loadNotifications())
    );
  }

  declineInvitation(invitationId: number) {
    return this.http.post(`/api/invitations/${invitationId}/decline/`, {}).pipe(
      tap(() => this.loadNotifications())
    );
  }
}
