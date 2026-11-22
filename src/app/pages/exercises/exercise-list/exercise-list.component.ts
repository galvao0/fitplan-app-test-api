import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadStatus } from '../../../core/models/api-response.model';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { ToastService } from '../../../core/services/toast.service';
import { readError } from '../../../core/utils/http-error';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

@Component({
  selector: 'app-exercise-list',
  imports: [
    DatePipe,
    HeaderComponent,
    ModalComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    LoadingComponent,
    IconComponent,
    ExerciseFormComponent
  ],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss'
})
export class ExerciseListComponent implements OnInit {
  private readonly exercises = inject(ExerciseService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly items = signal<Exercise[]>([]);
  readonly status = signal<LoadStatus>('loading');
  readonly term = signal('');
  readonly formOpen = signal(false);
  readonly editing = signal<Exercise | null>(null);
  readonly removing = signal<Exercise | null>(null);
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
    this.exercises.findAll().subscribe({
      next: (response) => {
        this.items.set(response.data ?? []);
        this.status.set('ready');
      },
      error: () => this.status.set('error')
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  openEdit(item: Exercise): void {
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
    this.exercises.remove(target.ID).subscribe({
      next: () => {
        this.removeBusy.set(false);
        this.removing.set(null);
        this.toast.success('Exercício excluído.');
        this.load(true);
      },
      error: (err) => {
        this.removeBusy.set(false);
        this.toast.error(readError(err, 'Não foi possível excluir o exercício.'));
      }
    });
  }
}
