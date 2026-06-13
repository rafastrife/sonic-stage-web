import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToWaitlist() {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  }
}
