import type { TopicKey } from '../i18n/types';

export type Patient = {
  forWhom: 'self' | 'other';
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
};

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  dayOffset: number;
  hour: number;
  doctorId: string;
  topic: TopicKey;
  /** Есть только у записей, сделанных через экран «Запись на приём» */
  patient?: Patient;
  problem?: string;
  /** Оплачена ли запись */
  paid?: boolean;
  /** Причина отмены */
  cancelReason?: string;
};

export const appointments: Appointment[] = [
  { id: 'a1', status: 'upcoming', dayOffset: 0, hour: 10, doctorId: 'd1', topic: 'mole', paid: true },
  { id: 'a2', status: 'upcoming', dayOffset: 2, hour: 9, doctorId: 'd3', topic: 'acne', paid: true },
  { id: 'a3', status: 'upcoming', dayOffset: 2, hour: 11, doctorId: 'd2', topic: 'consultation', paid: true },
  { id: 'a4', status: 'upcoming', dayOffset: 3, hour: 12, doctorId: 'd4', topic: 'dermatitis', paid: true },
  { id: 'a5', status: 'upcoming', dayOffset: 5, hour: 10, doctorId: 'd1', topic: 'consultation', paid: true },
  // Прошедшие записи — для вкладок «Завершённые» и «Отменённые»
  { id: 'p1', status: 'completed', dayOffset: -4, hour: 11, doctorId: 'd6', topic: 'consultation', paid: true },
  { id: 'p2', status: 'completed', dayOffset: -12, hour: 9, doctorId: 'd9', topic: 'acne', paid: true },
  { id: 'p3', status: 'completed', dayOffset: -20, hour: 14, doctorId: 'd2', topic: 'consultation', paid: true },
  { id: 'p4', status: 'cancelled', dayOffset: -7, hour: 15, doctorId: 'd8', topic: 'consultation', cancelReason: 'Неожиданная работа' },
];

/** Стоимость одного приёма, ₸ */
export const visitPrice = 15000;

export function formatPrice(value: number) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
}

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