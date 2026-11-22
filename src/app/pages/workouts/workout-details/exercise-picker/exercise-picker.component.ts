import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadStatus } from '../../../../core/models/api-response.model';
import { Exercise } from '../../../../core/models/exercise.model';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WorkoutService } from '../../../../core/services/workout.service';
import { readError } from '../../../../core/utils/http-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-exercise-picker',
  imports: [RouterLink, ModalComponent, LoadingComponent, IconComponent],
  templateUrl: './exercise-picker.component.html',
  styleUrl: './exercise-picker.component.scss'
})
export class ExercisePickerComponent implements OnInit {
  private readonly exercises = inject(ExerciseService);
  private readonly workouts = inject(WorkoutService);
  private readonly toast = inject(ToastService);

  readonly workoutId = input.required<number>();
  readonly attached = input.required<number[]>();
  readonly added = output<void>();
  readonly closed = output<void>();

  readonly items = signal<Exercise[]>([]);
  readonly status = signal<LoadStatus>('loading');
  readonly term = signal('');
  readonly busyId = signal<number | null>(null);

  readonly visible = computed(() => {
    const text = this.term().trim().toLowerCase();
    return text ? this.items().filter((item) => item.Name.toLowerCase().includes(text)) : this.items();
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status.set('loading');
    this.exercises.findAll().subscribe({
      next: (response) => {
        this.items.set(response.data ?? []);
        this.status.set('ready');
      },
      error: () => this.status.set('error')
    });
  }

  isAttached(id: number): boolean {
    return this.attached().includes(id);
  }

  onSearch(event: Event): void {
    this.term.set((event.target as HTMLInputElement).value);
  }

  add(item: Exercise): void {
    if (this.isAttached(item.ID) || this.busyId() !== null) {
      return;
    }
    this.busyId.set(item.ID);
    this.workouts.attachExercise(this.workoutId(), item.ID).subscribe({
      next: () => {
        this.busyId.set(null);
        this.toast.success(`${item.Name} adicionado ao treino.`);
        this.added.emit();
      },
      error: (err) => {
        this.busyId.set(null);
        this.toast.error(readError(err, 'Não foi possível adicionar o exercício.'));
      }
    });
  }
}
