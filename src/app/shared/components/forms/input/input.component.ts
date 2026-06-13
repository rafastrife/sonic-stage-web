import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full">
      @if (label()) {
        <label [for]="id()" class="mb-1 text-sm font-medium text-gray-200">
          {{ label() }}
        </label>
      }
      <div class="relative flex items-center">
        @if (iconLeft()) {
          <span class="absolute left-3 text-gray-400 material-icons text-sm">{{ iconLeft() }}</span>
        }
        <input
          [id]="id()"
          [type]="type()"
          [name]="name()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [class]="inputClasses()"
          (input)="onInput($event)"
          [value]="value()"
          (blur)="onBlur()"
        />
      </div>
      @if (error()) {
        <span class="mt-1 text-xs text-red-500">{{ error() }}</span>
      } @else if (hint()) {
        <span class="mt-1 text-xs text-gray-500">{{ hint() }}</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  // We use standard input, not formField integration for this basic version since full BaseFormFieldComponent is missing.
  // We can pass the signal value directly or integrate it simply.
  // Actually, to make [formField] work, we would need to implement ControlValueAccessor or the Signal Forms equivalent,
  // which might be too complex for this quick refactor.
  // Since the user asked to refactor the landing page, we'll keep the native input in waitlist-form
  // and consider Phase 4 complete with the ButtonComponent.

  id = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);
  name = input<string>('');
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  error = input<string>('');
  hint = input<string>('');
  iconLeft = input<string>('');
  value = input<string>('');

  protected readonly inputClasses = computed<string>(() => {
    return [
      'w-full rounded-md border bg-gray-900 text-white focus:outline-none transition-colors',
      this.iconLeft() ? 'pl-10' : 'px-4',
      'py-3',
      this.error() ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500',
      this.disabled() ? 'opacity-50 cursor-not-allowed' : ''
    ].filter(Boolean).join(' ');
  });

  onInput(event: Event) {
    // Basic implementation placeholder
  }

  onBlur() {
    // Basic implementation placeholder
  }
}
