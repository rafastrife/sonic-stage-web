import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BandStore } from '../../core/stores/band.store';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Membros da Banda</h1>
          <p class="text-neutral-400 mt-1">Gerencie quem tem acesso ao projeto.</p>
        </div>
      </div>

      @if (isOwner()) {
        <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Convidar Membro</h3>
            <div class="flex bg-neutral-950 border border-neutral-800 rounded-xl p-1">
              <button type="button" (click)="inviteMode.set('search')"
                      [class]="inviteMode() === 'search' ? 'bg-neon-cyan text-black' : 'text-neutral-400'"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Buscar usuário
              </button>
              <button type="button" (click)="inviteMode.set('link')"
                      [class]="inviteMode() === 'link' ? 'bg-neon-cyan text-black' : 'text-neutral-400'"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Gerar link
              </button>
            </div>
          </div>

          @if (inviteMode() === 'search') {
            <div class="flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[240px] relative">
                <label class="block text-sm font-medium text-neutral-400 mb-2">Buscar por nome ou e-mail</label>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearchChange($event)"
                  placeholder="Ex: Marina ou marina@email.com"
                  class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-cyan">

                @if (searchResults().length > 0) {
                  <div class="absolute z-10 mt-1 w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                    @for (u of searchResults(); track u.id) {
                      <button type="button" (click)="selectUser(u)" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 text-left transition-colors">
                        <div class="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-bold text-sm shrink-0">
                          {{ (u.display_name || u.username)[0] }}
                        </div>
                        <div class="min-w-0">
                          <div class="text-sm font-medium text-white truncate">{{ u.display_name || u.username }}</div>
                          <div class="text-xs text-neutral-500 truncate">{{ u.email }}</div>
                        </div>
                      </button>
                    }
                  </div>
                }
              </div>

              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-neutral-400 mb-2">Função (ex: Baterista)</label>
                <input type="text" [(ngModel)]="role" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-cyan">
              </div>

              <button type="button" (click)="sendDirectInvite()" [disabled]="!selectedUser() || !role"
                      class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl font-medium transition-colors h-12">
                Enviar Convite
              </button>
            </div>

            @if (selectedUser()) {
              <div class="mt-3 flex items-center gap-2 text-sm text-neutral-300">
                Convidando: <span class="font-bold text-white">{{ selectedUser().display_name || selectedUser().username }}</span>
                <button type="button" (click)="clearSelectedUser()" class="text-neutral-500 hover:text-white">✕</button>
              </div>
            }
          } @else {
            <div class="flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-neutral-400 mb-2">Função (ex: Baterista)</label>
                <input type="text" [(ngModel)]="linkRole" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-cyan">
              </div>
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-neutral-400 mb-2">E-mail (opcional)</label>
                <input type="email" [(ngModel)]="linkEmail" placeholder="pedro.drum@email.com" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-cyan">
              </div>
              <button type="button" (click)="generateLinkInvite()" [disabled]="!linkRole"
                      class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl font-medium transition-colors h-12">
                Gerar Link
              </button>
            </div>

            @if (generatedLink()) {
              <div class="mt-4 flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
                <input type="text" readonly [value]="generatedLink()" class="flex-1 bg-transparent text-neon-cyan text-sm outline-none">
                <button type="button" (click)="copyLink()" class="text-xs font-bold text-black bg-neon-cyan hover:bg-cyan-400 px-3 py-1.5 rounded-lg transition-colors">
                  {{ copied() ? 'Copiado!' : 'Copiar' }}
                </button>
              </div>
            }
          }

          @if (inviteError()) {
            <p class="mt-3 text-sm text-red-400">{{ inviteError() }}</p>
          }
          @if (inviteSuccess()) {
            <p class="mt-3 text-sm text-green-400">{{ inviteSuccess() }}</p>
          }
        </div>
      }

      @if (isOwner() && pendingInvitations().length > 0) {
        <h3 class="text-sm font-bold uppercase tracking-wide text-neutral-500 mb-3">Convites Pendentes</h3>
        <div class="space-y-3 mb-8">
          @for (invitation of pendingInvitations(); track invitation.id) {
            <div class="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4">
              <div>
                <div class="text-white font-medium">
                  {{ invitation.invited_user?.display_name || invitation.invite_email || 'Link de convite' }}
                </div>
                <div class="text-xs text-neutral-500 mt-0.5">
                  {{ invitation.role }} • {{ invitation.channel === 'LINK' ? 'Link' : 'Notificação direta' }} • {{ timeAgo(invitation.created_at) }}
                </div>
              </div>
              <div class="flex gap-2">
                <button type="button" (click)="resendInvitation(invitation)"
                        class="text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-lg transition-colors">
                  Reenviar
                </button>
                <button type="button" (click)="cancelInvitation(invitation)"
                        class="text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-red-900/50 px-3 py-2 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          }
        </div>
      }

      <h3 class="text-sm font-bold uppercase tracking-wide text-neutral-500 mb-3">Integrantes Ativos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (member of activeMembers(); track member.id) {
          <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-bold text-xl">
              {{ (member.user?.display_name || member.invite_email || '?')[0] }}
            </div>
            <div>
              <h4 class="font-bold text-white">{{ member.user?.display_name || member.invite_email }}</h4>
              <p class="text-sm text-neutral-400">{{ member.role }} • <span class="text-green-400">Ativo</span></p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MembersComponent implements OnInit {
  bandStore = inject(BandStore);
  authStore = inject(AuthStore);
  http = inject(HttpClient);

  members = signal<any[]>([]);
  activeMembers = signal<any[]>([]);
  pendingInvitations = signal<any[]>([]);

  searchQuery = '';
  searchResults = signal<any[]>([]);
  selectedUser = signal<any | null>(null);
  role = '';

  inviteError = signal<string | null>(null);
  inviteSuccess = signal<string | null>(null);

  inviteMode = signal<'search' | 'link'>('search');
  linkRole = '';
  linkEmail = '';
  generatedLink = signal<string | null>(null);
  copied = signal(false);

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.loadMembers();
    this.loadPendingInvitations();
  }

  isOwner(): boolean {
    const userId = this.authStore.currentUserId();
    const mine = this.members().find(m => m.user?.id === userId);
    return mine?.permission_level === 'ADMIN';
  }

  loadMembers() {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.http.get<any[]>(`/api/bands/${band.id}/members/`).subscribe(data => {
      this.members.set(data);
      this.activeMembers.set(data.filter(m => m.status === 'ACCEPTED'));
    });
  }

  loadPendingInvitations() {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.http.get<any[]>(`/api/bands/${band.id}/invitations/`).subscribe({
      next: (data) => this.pendingInvitations.set(data),
      error: () => this.pendingInvitations.set([]), // non-owners get 403 — no pending list to show
    });
  }

  resendInvitation(invitation: any) {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.http.post(`/api/bands/${band.id}/invitations/${invitation.id}/resend/`, {}).subscribe({
      next: () => {
        this.inviteSuccess.set('Convite reenviado.');
        this.loadPendingInvitations();
      },
      error: (err) => this.inviteError.set(err?.error?.detail || 'Não foi possível reenviar o convite.'),
    });
  }

  cancelInvitation(invitation: any) {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.http.post(`/api/bands/${band.id}/invitations/${invitation.id}/cancel/`, {}).subscribe({
      next: () => {
        this.inviteSuccess.set('Convite cancelado.');
        this.loadPendingInvitations();
      },
      error: (err) => this.inviteError.set(err?.error?.detail || 'Não foi possível cancelar o convite.'),
    });
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

  onSearchChange(query: string) {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    const band = this.bandStore.activeBand();
    if (!band || query.trim().length < 2) {
      this.searchResults.set([]);
      return;
    }
    this.searchDebounce = setTimeout(() => {
      this.http
        .get<any[]>(`/api/bands/${band.id}/invitable-users/`, { params: { q: query.trim() } })
        .subscribe(results => this.searchResults.set(results));
    }, 300);
  }

  selectUser(user: any) {
    this.selectedUser.set(user);
    this.searchResults.set([]);
    this.searchQuery = user.display_name || user.username;
  }

  clearSelectedUser() {
    this.selectedUser.set(null);
    this.searchQuery = '';
  }

  sendDirectInvite() {
    const band = this.bandStore.activeBand();
    const user = this.selectedUser();
    if (!band || !user || !this.role) return;

    this.inviteError.set(null);
    this.inviteSuccess.set(null);

    this.http
      .post(`/api/bands/${band.id}/invitations/`, {
        channel: 'DIRECT',
        invited_user_id: user.id,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.inviteSuccess.set(`Convite enviado para ${user.display_name || user.username}.`);
          this.clearSelectedUser();
          this.role = '';
          this.loadMembers();
          this.loadPendingInvitations();
        },
        error: (err) => {
          this.inviteError.set(err?.error?.detail || 'Não foi possível enviar o convite.');
        },
      });
  }

  generateLinkInvite() {
    const band = this.bandStore.activeBand();
    if (!band || !this.linkRole) return;

    this.inviteError.set(null);
    this.inviteSuccess.set(null);
    this.generatedLink.set(null);
    this.copied.set(false);

    this.http
      .post<{ invite_link: string }>(`/api/bands/${band.id}/invitations/`, {
        channel: 'LINK',
        role: this.linkRole,
        invite_email: this.linkEmail || undefined,
      })
      .subscribe({
        next: (result) => {
          this.generatedLink.set(result.invite_link);
          this.linkRole = '';
          this.linkEmail = '';
          this.loadPendingInvitations();
        },
        error: (err) => {
          this.inviteError.set(err?.error?.detail || 'Não foi possível gerar o link de convite.');
        },
      });
  }

  copyLink() {
    const link = this.generatedLink();
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
