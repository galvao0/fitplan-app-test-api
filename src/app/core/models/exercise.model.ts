export interface Exercise {
  ID: number;
  Name: string;
  Weight: number;
  Reps: number;
  Sets: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
}

export interface ExerciseRequest {
  name: string;
  weight: number;
  reps: number;
  sets: number;
}
