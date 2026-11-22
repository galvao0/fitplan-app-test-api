import { Exercise } from './exercise.model';

export interface Workout {
  ID: number;
  Name: string;
  Image: string;
  Exercises: Exercise[] | null;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}

export interface WorkoutRequest {
  name: string;
  image: string;
}

export function exerciseCount(workout: Workout): number {
  return workout.Exercises?.length ?? 0;
}
