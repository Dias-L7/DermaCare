import type { ErrorKey } from '../i18n/types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }
  return digits;
}

export function isEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function isPhone(value: string) {
  return /^7\d{10}$/.test(normalizePhone(value));
}

export function validateIdentifier(value: string): ErrorKey | null {
  if (!value.trim()) return 'required';
  return isEmail(value) || isPhone(value) ? null : 'identifier';
}

export function validateEmail(value: string): ErrorKey | null {
  if (!value.trim()) return 'required';
  return isEmail(value) ? null : 'email';
}

export function validatePhone(value: string): ErrorKey | null {
  if (!value.trim()) return 'required';
  return isPhone(value) ? null : 'phone';
}

export function validateName(value: string): ErrorKey | null {
  if (!value.trim()) return 'required';
  return value.trim().length >= 2 ? null : 'nameShort';
}

export function validatePassword(value: string): ErrorKey | null {
  if (!value) return 'required';
  return value.length >= 6 ? null : 'passwordShort';
}

export function validateConfirm(password: string, confirm: string): ErrorKey | null {
  if (!confirm) return 'required';
  return password === confirm ? null : 'passwordMismatch';
}

export function validateBirthDate(value: string): ErrorKey | null {
  if (!value.trim()) return 'required';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return 'date';

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  const real = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!real || year < 1900) return 'date';
  if (date.getTime() > Date.now()) return 'dateFuture';
  return null;
}
