import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TabbarComponent } from '../../shared/components/tabbar/tabbar.component';
import { ToastHostComponent } from '../../shared/components/toast-host/toast-host.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TabbarComponent, ToastHostComponent, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {}
