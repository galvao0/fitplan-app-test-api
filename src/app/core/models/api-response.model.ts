export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type LoadStatus = 'loading' | 'ready' | 'error';
