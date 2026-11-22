import { Component, input, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-cover',
  imports: [IconComponent],
  templateUrl: './cover.component.html',
  styleUrl: './cover.component.scss'
})
export class CoverComponent {
  readonly src = input<string | null | undefined>('');
  readonly alt = input('');
  readonly broken = signal(false);
}
