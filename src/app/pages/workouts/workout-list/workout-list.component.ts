import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadStatus } from '../../../core/models/api-response.model';
import { Workout, exerciseCount } from '../../../core/models/workout.model';
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
import { PluralPipe } from '../../../shared/pipes/plural.pipe';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';

@Component({
  selector: 'app-workout-list',
  imports: [
    RouterLink,
    DatePipe,
    PluralPipe,
    HeaderComponent,
    ModalComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    LoadingComponent,
    CoverComponent,
    IconComponent,
    WorkoutFormComponent
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss',
  host: { '(document:click)': 'openMenu.set(null)' }
})
export class WorkoutListComponent implements OnInit {
  private readonly workouts = inject(WorkoutService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly count = exerciseCount;
  readonly items = signal<Workout[]>([]);
  readonly status = signal<LoadStatus>('loading');
  readonly term = signal('');
  readonly openMenu = signal<number | null>(null);
  readonly formOpen = signal(false);
  readonly editing = signal<Workout | null>(null);
  readonly removing = signal<Workout | null>(null);
  readonly removeBusy = signal(false);

  readonly visible = computed(() => {
    const text = this.term().trim().toLowerCase();
    return text ? this.items().filter((item) => item.Name.toLowerCase().includes(text)) : this.items();
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.has('new')) {
      this.formOpen.set(true);
    }
    this.load();
  }

  load(silent = false): void {
    if (!silent) {
      this.status.set('loading');
    }
    this.workouts.findAll().subscribe({
      next: (response) => {
        this.items.set(response.data ?? []);
        this.status.set('ready');
      },
      error: () => this.status.set('error')
    });
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.openMenu.update((current) => (current === id ? null : id));
  }

  openCreate(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  openEdit(item: Workout): void {
    this.editing.set(item);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editing.set(null);
  }

  onSaved(): void {
    this.closeForm();
    this.load(true);
  }

  confirmRemove(): void {
    const target = this.removing();
    if (!target) {
      return;
    }
    this.removeBusy.set(true);
    this.workouts.remove(target.ID).subscribe({
      next: () => {
        this.removeBusy.set(false);
        this.removing.set(null);
        this.toast.success('Treino excluído.');
        this.load(true);
      },
      error: (err) => {
        this.removeBusy.set(false);
        this.toast.error(readError(err, 'Não foi possível excluir o treino.'));
      }
    });
  }
}
