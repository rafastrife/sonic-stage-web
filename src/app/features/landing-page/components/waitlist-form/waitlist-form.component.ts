import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../../../services/lead.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-waitlist-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './waitlist-form.component.html',
})
export class WaitlistFormComponent {
  private leadService = inject(LeadService);

  email = signal<string>('');
  isSubmitting = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (!this.email() || !this.email().includes('@')) {
      this.errorMessage.set('Por favor, informe um e-mail válido.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.leadService.registerLead({ email: this.email() }).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message || 'Cadastro realizado!');
          this.email.set('');
        } else {
          this.errorMessage.set(response.errors?.['email']?.[0] || 'Erro ao cadastrar.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Falha na comunicação com o servidor. Tente novamente mais tarde.');
      }
    });
  }
}
