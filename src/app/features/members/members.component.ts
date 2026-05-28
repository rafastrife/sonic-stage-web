import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BandStore } from '../../core/stores/band.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Membros da Banda</h1>
          <p class="text-neutral-400 mt-1">Gerencie quem tem acesso ao projeto.</p>
        </div>
      </div>

      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8">
        <h3 class="text-xl font-bold mb-4">Convidar Membro</h3>
        <form [formGroup]="inviteForm" (ngSubmit)="inviteMember()" class="flex flex-wrap items-end gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-neutral-400 mb-2">E-mail</label>
            <input type="email" formControlName="invite_email" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-neutral-400 mb-2">Função (ex: Baterista)</label>
            <input type="text" formControlName="role" class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
          </div>
          <button type="submit" [disabled]="inviteForm.invalid || !bandStore.activeBand()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors h-12">
            Enviar Convite
          </button>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let member of members()" class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl">
            {{ member.user ? member.user.display_name[0] : member.invite_email[0] }}
          </div>
          <div>
            <h4 class="font-bold text-white">{{ member.user ? member.user.display_name : member.invite_email }}</h4>
            <p class="text-sm text-neutral-400">{{ member.role }} • <span [class.text-green-400]="member.status==='ACCEPTED'" [class.text-yellow-400]="member.status==='PENDING'">{{ member.status }}</span></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MembersComponent implements OnInit {
  bandStore = inject(BandStore);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  members = signal<any[]>([]);

  inviteForm = this.fb.nonNullable.group({
    invite_email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    permission_level: ['MEMBER'],
    status: ['PENDING']
  });

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    const band = this.bandStore.activeBand();
    if (!band) return;
    this.http.get<any[]>(`/api/bands/${band.id}/members/`).subscribe(data => this.members.set(data));
  }

  inviteMember() {
    const band = this.bandStore.activeBand();
    if (this.inviteForm.valid && band) {
      this.http.post(`/api/bands/${band.id}/members/`, this.inviteForm.getRawValue()).subscribe(() => {
        this.inviteForm.reset({permission_level: 'MEMBER', status: 'PENDING'});
        this.loadMembers();
      });
    }
  }
}
