import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tabbar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './tabbar.component.html',
  styleUrl: './tabbar.component.scss'
})
export class TabbarComponent {
  readonly tabs = [
    { path: '/dashboard', label: 'Início', icon: 'dashboard' },
    { path: '/workouts', label: 'Treinos', icon: 'clipboard' },
    { path: '/exercises', label: 'Exercícios', icon: 'dumbbell' }
  ];
}
