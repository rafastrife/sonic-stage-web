import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);

  scrollTo(elementId: string) {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
