import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Workout, WorkoutRequest } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly http = inject(HttpClient);
  private readonly listUrl = `${environment.apiUrl}/workouts`;
  private readonly itemUrl = `${environment.apiUrl}/workout`;

  findAll(): Observable<ApiResponse<Workout[]>> {
    return this.http.get<ApiResponse<Workout[]>>(this.listUrl);
  }

  findOne(id: number): Observable<ApiResponse<Workout>> {
    return this.http.get<ApiResponse<Workout>>(this.itemUrl, { params: { id } });
  }

  create(body: WorkoutRequest): Observable<ApiResponse<Workout>> {
    return this.http.post<ApiResponse<Workout>>(this.itemUrl, body);
  }

  update(id: number, body: WorkoutRequest): Observable<ApiResponse<Workout>> {
    return this.http.put<ApiResponse<Workout>>(this.itemUrl, body, { params: { id } });
  }

  remove(id: number): Observable<ApiResponse<Workout>> {
    return this.http.delete<ApiResponse<Workout>>(this.itemUrl, { params: { id } });
  }

  attachExercise(workoutId: number, exerciseId: number): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.itemUrl}/${workoutId}/exercise/${exerciseId}`,
      {}
    );
  }
}
