import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoadStatus } from '../../core/models/api-response.model';
import { Exercise } from '../../core/models/exercise.model';
import { Workout, exerciseCount } from '../../core/models/workout.model';
import { ExerciseService } from '../../core/services/exercise.service';
import { WorkoutService } from '../../core/services/workout.service';
import { CoverComponent } from '../../shared/components/cover/cover.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PluralPipe } from '../../shared/pipes/plural.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe,
    PluralPipe,
    HeaderComponent,
    LoadingComponent,
    EmptyStateComponent,
    CoverComponent,
    IconComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly workouts = inject(WorkoutService);
  private readonly exercises = inject(ExerciseService);

  readonly count = exerciseCount;
  readonly status = signal<LoadStatus>('loading');
  readonly workoutList = signal<Workout[]>([]);
  readonly exerciseList = signal<Exercise[]>([]);

  readonly recent = computed(() =>
    [...this.workoutList()]
      .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    forkJoin({
      workouts: this.workouts.findAll(),
      exercises: this.exercises.findAll()
    }).subscribe({
      next: ({ workouts, exercises }) => {
        this.workoutList.set(workouts.data ?? []);
        this.exerciseList.set(exercises.data ?? []);
        this.status.set('ready');
      },
      error: () => this.status.set('error')
    });
  }
}
