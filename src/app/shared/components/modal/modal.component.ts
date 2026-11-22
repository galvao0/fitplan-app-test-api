import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' }
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly wide = input(false);
  readonly closed = output<void>();
}
