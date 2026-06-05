import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  faqs = signal<FaqItem[]>([
    {
      question: 'Quando a Sonic Stage será lançada?',
      answer: 'Estamos em fase final de testes (Beta Fechado). Nossa expectativa é liberar o acesso antecipado nas próximas semanas para os primeiros inscritos na lista de espera.',
      isOpen: false
    },
    {
      question: 'É gratuito para bandas independentes?',
      answer: 'Sim! Teremos um plano gratuito robusto (Free Tier) perfeito para bandas de até 5 membros gerenciarem seus repertórios e ensaios.',
      isOpen: false
    },
    {
      question: 'Posso usar a plataforma offline?',
      answer: 'A versão final da plataforma terá capacidades de Progressive Web App (PWA) e cache local para que você possa consultar seus repertórios e setlists mesmo naquele pub com conexão ruim.',
      isOpen: false
    }
  ]);

  toggleFaq(index: number) {
    this.faqs.update(items => {
      const newItems = [...items];
      newItems[index].isOpen = !newItems[index].isOpen;
      return newItems;
    });
  }
}
