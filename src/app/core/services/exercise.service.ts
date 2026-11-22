import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Exercise, ExerciseRequest } from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly http = inject(HttpClient);
  private readonly listUrl = `${environment.apiUrl}/exercises`;
  private readonly itemUrl = `${environment.apiUrl}/exercise`;

  findAll(): Observable<ApiResponse<Exercise[]>> {
    return this.http.get<ApiResponse<Exercise[]>>(this.listUrl);
  }

  findOne(id: number): Observable<ApiResponse<Exercise>> {
    return this.http.get<ApiResponse<Exercise>>(this.itemUrl, { params: { id } });
  }

  create(body: ExerciseRequest): Observable<ApiResponse<Exercise>> {
    return this.http.post<ApiResponse<Exercise>>(this.itemUrl, body);
  }

  update(id: number, body: ExerciseRequest): Observable<ApiResponse<Exercise>> {
    return this.http.put<ApiResponse<Exercise>>(this.itemUrl, body, { params: { id } });
  }

  remove(id: number): Observable<ApiResponse<Exercise>> {
    return this.http.delete<ApiResponse<Exercise>>(this.itemUrl, { params: { id } });
  }
}
