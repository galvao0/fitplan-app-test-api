import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadStatus } from '../../../core/models/api-response.model';
import { Workout } from '../../../core/models/workout.model';
import { ToastService } from '../../../core/services/toast.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { readError } from '../../../core/utils/http-error';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CoverComponent } from '../../../shared/components/cover/cover.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';
import { ExercisePickerComponent } from './exercise-picker/exercise-picker.component';

@Component({
  selector: 'app-workout-details',
  imports: [
    DatePipe,
    RouterLink,
    HeaderComponent,
    LoadingComponent,
    EmptyStateComponent,
    CoverComponent,
    IconComponent,
    ModalComponent,
    ConfirmDialogComponent,
    WorkoutFormComponent,
    ExercisePickerComponent
  ],
  templateUrl: './workout-details.component.html',
  styleUrl: './workout-details.component.scss'
})
export class WorkoutDetailsComponent implements OnInit {
  private readonly workouts = inject(WorkoutService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private id = 0;

  readonly workout = signal<Workout | null>(null);
  readonly status = signal<LoadStatus>('loading');
  readonly editOpen = signal(false);
  readonly pickerOpen = signal(false);
  readonly removeOpen = signal(false);
  readonly removeBusy = signal(false);

  readonly exercises = computed(() => this.workout()?.Exercises ?? []);
  readonly attachedIds = computed(() => this.exercises().map((item) => item.ID));
  readonly totalSets = computed(() => this.exercises().reduce((sum, item) => sum + item.Sets, 0));
  readonly totalReps = computed(() => this.exercises().reduce((sum, item) => sum + item.Reps, 0));

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(silent = false): void {
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.status.set('error');
      return;
    }
    if (!silent) {
      this.status.set('loading');
    }
    this.workouts.findOne(this.id).subscribe({
      next: (response) => {
        this.workout.set(response.data);
        this.status.set('ready');
      },
      error: () => this.status.set('error')
    });
  }

  onEdited(): void {
    this.editOpen.set(false);
    this.load(true);
  }

  onAttached(): void {
    this.load(true);
  }

  confirmRemove(): void {
    this.removeBusy.set(true);
    this.workouts.remove(this.id).subscribe({
      next: () => {
        this.removeBusy.set(false);
        this.toast.success('Treino excluído.');
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        this.removeBusy.set(false);
        this.toast.error(readError(err, 'Não foi possível excluir o treino.'));
      }
    });
  }
}
