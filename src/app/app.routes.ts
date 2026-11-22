import { Routes } from '@angular/router';
import { ShellComponent } from './template/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'workouts',
        loadComponent: () =>
          import('./pages/workouts/workout-list/workout-list.component').then(
            (m) => m.WorkoutListComponent
          )
      },
      {
        path: 'workouts/:id',
        loadComponent: () =>
          import('./pages/workouts/workout-details/workout-details.component').then(
            (m) => m.WorkoutDetailsComponent
          )
      },
      {
        path: 'exercises',
        loadComponent: () =>
          import('./pages/exercises/exercise-list/exercise-list.component').then(
            (m) => m.ExerciseListComponent
          )
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
