import type { SpecialtyKey } from '../i18n/types';

export type Gender = 'female' | 'male';

export type Doctor = {
  id: string;
  name: string;
  gender: Gender;
  specialty: SpecialtyKey;
  rating: number;
  reviews: number;
  experience: number;
  avatar: number;
  /** Фото врача (randomuser.me). Если не загрузится — показывается SVG-аватар. */
  photo?: string;
};