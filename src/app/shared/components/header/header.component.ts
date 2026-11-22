import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly backLink = input('');
  readonly backLabel = input('Voltar');
  readonly searchPlaceholder = input('');
  readonly searchChange = output<string>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
