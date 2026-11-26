import { localDoctors } from '../data/doctors';
import { DOCTORS_URL } from './config';
import type { Doctor } from './types';

export async function fetchDoctors(): Promise<Doctor[]> {
  if (!DOCTORS_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return localDoctors;
  }

  const response = await fetch(DOCTORS_URL);
  if (!response.ok) {
    throw new Error('Ошибка загрузки списка врачей');
  }

  const data = (await response.json()) as Doctor[];
  if (!Array.isArray(data)) {
    throw new Error('Неверный формат данных');
  }
  return data;
}
