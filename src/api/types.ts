import type { SpecialtyKey } from '../i18n/types';

export type Doctor = {
  id: string;
  name: string;
  specialty: SpecialtyKey;
  rating: number;
  reviews: number;
  experience: number;
  avatar: number;
};
