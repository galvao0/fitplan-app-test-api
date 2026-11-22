import { HttpErrorResponse } from '@angular/common/http';

export function readError(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'Não foi possível conectar à API.';
    }
    const body = err.error;
    if (body && typeof body === 'object') {
      const fields = body as Record<string, unknown>;
      const text = fields['message'] ?? fields['error'];
      if (typeof text === 'string' && text.length > 0) {
        return text;
      }
    }
  }
  return fallback;
}
