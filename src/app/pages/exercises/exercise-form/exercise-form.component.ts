import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Exercise, ExerciseRequest } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { ToastService } from '../../../core/services/toast.service';
import { fieldError, integer, notBlank } from '../../../core/utils/form-validators';
import { readError } from '../../../core/utils/http-error';

@Component({
  selector: 'app-exercise-form',
  imports: [ReactiveFormsModule],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss'
})
export class ExerciseFormComponent implements OnInit {
  private readonly builder = inject(FormBuilder);
  private readonly exercises = inject(ExerciseService);
  private readonly toast = inject(ToastService);

  readonly exercise = input<Exercise | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly busy = signal(false);
  readonly fieldError = fieldError;

  readonly form = this.builder.nonNullable.group({
    name: ['', [Validators.required, notBlank, Validators.maxLength(100)]],
    weight: [0, [Validators.required, Validators.min(0), integer]],
    sets: [3, [Validators.required, Validators.min(0), Validators.max(65535), integer]],
    reps: [12, [Validators.required, Validators.min(0), Validators.max(65535), integer]]
  });

  ngOnInit(): void {
    const current = this.exercise();
    if (current) {
      this.form.patchValue({
        name: current.Name,
        weight: current.Weight,
        sets: current.Sets,
        reps: current.Reps
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const body: ExerciseRequest = {
      name: raw.name.trim(),
      weight: Number(raw.weight),
      reps: Number(raw.reps),
      sets: Number(raw.sets)
    };
    const current = this.exercise();
    const request = current
      ? this.exercises.update(current.ID, body)
      : this.exercises.create(body);

    this.busy.set(true);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.success(current ? 'Exercício atualizado.' : 'Exercício criado.');
        this.saved.emit();
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.error(readError(err, 'Não foi possível salvar o exercício.'));
      }
    });
  }
}
