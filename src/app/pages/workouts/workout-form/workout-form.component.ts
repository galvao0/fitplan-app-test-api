import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Workout, WorkoutRequest } from '../../../core/models/workout.model';
import { ToastService } from '../../../core/services/toast.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { fieldError, notBlank, optionalHttpUrl } from '../../../core/utils/form-validators';
import { readError } from '../../../core/utils/http-error';

@Component({
  selector: 'app-workout-form',
  imports: [ReactiveFormsModule],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.scss'
})
export class WorkoutFormComponent implements OnInit {
  private readonly builder = inject(FormBuilder);
  private readonly workouts = inject(WorkoutService);
  private readonly toast = inject(ToastService);

  readonly workout = input<Workout | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly busy = signal(false);
  readonly fieldError = fieldError;

  readonly form = this.builder.nonNullable.group({
    name: ['', [Validators.required, notBlank, Validators.maxLength(100)]],
    image: ['', [optionalHttpUrl]]
  });

  ngOnInit(): void {
    const current = this.workout();
    if (current) {
      this.form.patchValue({ name: current.Name, image: current.Image ?? '' });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const body: WorkoutRequest = { name: raw.name.trim(), image: raw.image.trim() };
    const current = this.workout();
    const request = current
      ? this.workouts.update(current.ID, body)
      : this.workouts.create(body);

    this.busy.set(true);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.success(current ? 'Treino atualizado.' : 'Treino criado.');
        this.saved.emit();
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.error(readError(err, 'Não foi possível salvar o treino.'));
      }
    });
  }
}
