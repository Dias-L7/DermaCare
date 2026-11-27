import type { TopicKey } from '../i18n/types';

export type Patient = {
  forWhom: 'self' | 'other';
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
};

export type Appointment = {
  id: string;
  dayOffset: number;
  hour: number;
  doctorId: string;
  topic: TopicKey;
  /** Есть только у записей, сделанных через экран «Запись на приём» */
  patient?: Patient;
  problem?: string;
};

export const appointments: Appointment[] = [
  { id: 'a1', dayOffset: 0, hour: 10, doctorId: 'd1', topic: 'mole' },
  { id: 'a2', dayOffset: 2, hour: 9, doctorId: 'd3', topic: 'acne' },
  { id: 'a3', dayOffset: 2, hour: 11, doctorId: 'd2', topic: 'consultation' },
  { id: 'a4', dayOffset: 3, hour: 12, doctorId: 'd4', topic: 'dermatitis' },
  { id: 'a5', dayOffset: 5, hour: 10, doctorId: 'd1', topic: 'consultation' },
];

export const workHours = [9, 10, 11, 12];

/** Часы приёма, которые можно выбрать при записи */
export const bookingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

/** Сколько дней вперёд можно записаться */
export const bookingDays = 30;

/** Имитация занятости врача: одни и те же часы всегда «заняты» для этого врача и дня */
export function isDoctorBusy(doctorId: string, dayOffset: number, hour: number) {
  const seed = doctorId.length * 7 + Number(doctorId.replace(/\D/g, '') || 0) * 3 + dayOffset * 5 + hour;
  return seed % 4 === 0;
}