import type { TopicKey } from '../i18n/types';

export type Appointment = {
  id: string;
  dayOffset: number;
  hour: number;
  doctorId: string;
  topic: TopicKey;
};

export const appointments: Appointment[] = [
  { id: 'a1', dayOffset: 0, hour: 10, doctorId: 'd1', topic: 'mole' },
  { id: 'a2', dayOffset: 2, hour: 9, doctorId: 'd3', topic: 'acne' },
  { id: 'a3', dayOffset: 2, hour: 11, doctorId: 'd2', topic: 'consultation' },
  { id: 'a4', dayOffset: 3, hour: 12, doctorId: 'd4', topic: 'dermatitis' },
  { id: 'a5', dayOffset: 5, hour: 10, doctorId: 'd1', topic: 'consultation' },
];

export const workHours = [9, 10, 11, 12];
