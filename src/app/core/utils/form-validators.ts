import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notBlank(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim().length === 0 ? { required: true } : null;
}

export function integer(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '') {
    return null;
  }
  return Number.isInteger(Number(value)) ? null : { integer: true };
}

export function optionalHttpUrl(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return null;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
  } catch {
    return { url: true };
  }
}

export function fieldError(control: AbstractControl | null): string {
  if (!control || !control.touched || !control.errors) {
    return '';
  }
  const errors = control.errors;
  if (errors['required']) return 'Campo obrigatório.';
  if (errors['min']) return 'O valor não pode ser negativo.';
  if (errors['max']) return `O valor máximo é ${errors['max'].max}.`;
  if (errors['maxlength']) return `Use no máximo ${errors['maxlength'].requiredLength} caracteres.`;
  if (errors['integer']) return 'Informe um número inteiro.';
  if (errors['url']) return 'Informe uma URL iniciada por http:// ou https://.';
  return 'Valor inválido.';
}
