import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [class]="customClass" viewBox="0 0 350 120" xmlns="http://www.w3.org/2000/svg" class="select-none block">
      <!-- Soundwave -->
      <g transform="translate(0, 10)">
        <rect x="10" y="35" width="8" height="30" rx="4" fill="#00e5ff" />
        <rect x="25" y="25" width="8" height="50" rx="4" fill="#00e5ff" />
        <rect x="40" y="5" width="8" height="90" rx="4" fill="#ff007f" />
        <rect x="55" y="20" width="8" height="60" rx="4" fill="#ffb300" />
        <rect x="70" y="35" width="8" height="30" rx="4" fill="#00e5ff" />
      </g>
      
      <!-- Text -->
      <text x="95" y="55" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="1">SONIC</text>
      <text x="95" y="95" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="44" fill="#00e5ff" letter-spacing="2">STAGE</text>
      
      <!-- Subtitle -->
      <text x="98" y="115" font-family="'Inter', system-ui, sans-serif" font-weight="800" font-size="10" fill="#ffb300" letter-spacing="3.5">YOUR MUSIC. YOUR STAGE.</text>
    </svg>
  `
})
export class LogoComponent {
  @Input('class') customClass = 'w-48 h-auto';
}
