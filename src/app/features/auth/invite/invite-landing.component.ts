import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/stores/auth.store';
import { BandStore } from '../../../core/stores/band.store';
import { LogoComponent } from '../../../shared/components/logo.component';

interface InvitationPreview {
  id: number;
  band_name: string;
  inviter_name: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-invite-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="w-full max-w-[420px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 z-10 text-center">
        <app-logo class="w-48 mx-auto mb-6"></app-logo>

        @if (loading()) {
          <p class="text-neutral-400">Carregando convite...</p>
        } @else if (!preview()) {
          <h2 class="text-xl font-bold text-white mb-2">Convite não encontrado</h2>
          <p class="text-neutral-400">Este link de convite é inválido.</p>
        } @else if (preview()!.status !== 'PENDING') {
          <h2 class="text-xl font-bold text-white mb-2">Convite não está mais disponível</h2>
          <p class="text-neutral-400">Este convite já foi {{ statusLabel() }}.</p>
        } @else {
          <h2 class="text-xl font-bold text-white mb-2">Você foi convidado!</h2>
          <p class="text-neutral-300 mb-6">
            <span class="font-bold">{{ preview()!.inviter_name }}</span> te chamou para integrar a banda
            <span class="text-neon-cyan font-bold">{{ preview()!.band_name }}</span>
            como <span class="font-bold">{{ preview()!.role }}</span>.
          </p>

          @if (authStore.isAuthenticated()) {
            @if (actionError()) {
              <p class="text-sm text-red-400 mb-4">{{ actionError() }}</p>
            }
            <div class="flex gap-3 justify-center">
              <button (click)="accept()" [disabled]="submitting()"
                      class="bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 text-black px-6 py-3 rounded-xl font-bold transition-colors">
                Aceitar
              </button>
              <button (click)="decline()" [disabled]="submitting()"
                      class="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Recusar
              </button>
            </div>
          } @else {
            <div class="flex flex-col gap-3">
              <a [routerLink]="['/register']" [queryParams]="{ redirect: '/invite/' + token }"
                 class="bg-neon-cyan hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold transition-colors">
                Criar Conta e Aceitar
              </a>
              <a [routerLink]="['/login']" [queryParams]="{ redirect: '/invite/' + token }"
                 class="text-sm text-neon-cyan hover:text-white transition-colors">
                Já tenho conta — Entrar
              </a>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class InviteLandingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  authStore = inject(AuthStore);
  private bandStore = inject(BandStore);

  token = '';
  loading = signal(true);
  preview = signal<InvitationPreview | null>(null);
  submitting = signal(false);
  actionError = signal<string | null>(null);

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.http.get<InvitationPreview>(`/api/invitations/by-token/${this.token}/`).subscribe({
      next: (data) => {
        this.preview.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.preview.set(null);
        this.loading.set(false);
      },
    });
  }

  statusLabel(): string {
    switch (this.preview()?.status) {
      case 'ACCEPTED': return 'aceito';
      case 'DECLINED': return 'recusado';
      case 'CANCELED': return 'cancelado';
      default: return '';
    }
  }

  accept() {
    const invitation = this.preview();
    if (!invitation) return;
    this.submitting.set(true);
    this.actionError.set(null);
    this.http.post(`/api/invitations/${invitation.id}/accept/`, {}).subscribe({
      next: () => {
        this.bandStore.loadUserBands();
        this.router.navigate(['/dashboard/members']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.detail || 'Não foi possível aceitar o convite.');
      },
    });
  }

  decline() {
    const invitation = this.preview();
    if (!invitation) return;
    this.submitting.set(true);
    this.actionError.set(null);
    this.http.post(`/api/invitations/${invitation.id}/decline/`, {}).subscribe({
      next: () => {
        this.preview.update(p => (p ? { ...p, status: 'DECLINED' } : p));
        this.submitting.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.detail || 'Não foi possível recusar o convite.');
      },
    });
  }
}
