import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="hostClasses()"
      (click)="onClick($event)">
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      @if (iconLeft() && !loading()) {
        <span class="mr-2 material-icons">{{ iconLeft() }}</span>
      }
      <ng-content></ng-content>
      @if (iconRight()) {
        <span class="ml-2 material-icons">{{ iconRight() }}</span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  full = input<boolean>(false);
  iconLeft = input<string>();
  iconRight = input<string>();
  customClass = input<string>('');

  protected readonly hostClasses = computed<string>(() => {
    const baseClasses = 'inline-flex items-center justify-center font-bold rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';
    
    let variantClasses = '';
    switch (this.variant()) {
      case 'primary':
        variantClasses = 'bg-primary hover:bg-primary-hover text-black shadow-glow-primary hover:shadow-glow-primary-strong';
        break;
      case 'secondary':
        variantClasses = 'bg-accent hover:bg-accent-hover text-black';
        break;
      case 'outline':
        variantClasses = 'bg-transparent border border-primary text-primary hover:bg-primary/10';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent text-gray-300 hover:text-white';
        break;
      case 'danger':
        variantClasses = 'bg-danger-container hover:bg-danger-container/80 text-danger';
        break;
    }

    let sizeClasses = '';
    switch (this.size()) {
      case 'sm':
        sizeClasses = 'px-4 py-2 text-sm';
        break;
      case 'md':
        sizeClasses = 'px-6 py-3 text-base';
        break;
      case 'lg':
        sizeClasses = 'px-8 py-4 text-lg';
        break;
    }

    const fullClass = this.full() ? 'w-full' : '';
    const disabledClass = (this.disabled() || this.loading()) ? 'opacity-50 cursor-not-allowed' : '';

    return [baseClasses, variantClasses, sizeClasses, fullClass, disabledClass, this.customClass()].filter(Boolean).join(' ');
  });

  onClick(event: Event) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
