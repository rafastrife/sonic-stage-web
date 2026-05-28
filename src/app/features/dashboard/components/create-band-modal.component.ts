import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandStore } from '../../../core/stores/band.store';

@Component({
  selector: 'app-create-band-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white tracking-tight">Nova Banda</h2>
          <button (click)="close()" class="text-neutral-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="bandForm" (ngSubmit)="onSubmit()">
          
          <div class="mb-4">
            <label class="block text-xs font-bold tracking-widest text-neutral-400 uppercase mb-2">Nome da Banda</label>
            <input type="text" formControlName="name" class="w-full bg-black border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors" placeholder="Ex: The Rockers">
          </div>
          
          <div class="mb-6">
            <label class="block text-xs font-bold tracking-widest text-neutral-400 uppercase mb-2">Gênero</label>
            <input type="text" formControlName="genre" class="w-full bg-black border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors" placeholder="Ex: Rock Alternativo">
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" (click)="close()" class="px-6 py-2.5 rounded-full font-bold text-neutral-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="bandForm.invalid || isSubmitting" class="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black px-6 py-2.5 rounded-full font-bold transition-colors">
              {{ isSubmitting ? 'Criando...' : 'Criar Banda' }}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  `
})
export class CreateBandModalComponent {
  bandStore = inject(BandStore);
  fb = inject(FormBuilder);
  
  isOpen = false;
  isSubmitting = false;

  bandForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    genre: ['']
  });

  constructor() {
    window.addEventListener('open-create-band-modal', () => {
      this.open();
    });
  }

  open() {
    this.isOpen = true;
    this.bandForm.reset();
  }

  close() {
    this.isOpen = false;
  }

  onSubmit() {
    if (this.bandForm.valid) {
      this.isSubmitting = true;
      this.bandStore.createBand(this.bandForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.close();
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          // Ideally handle error display here
        }
      });
    }
  }
}
