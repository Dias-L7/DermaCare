import doctorsJson from '../../server/doctors.json';
import type { Doctor } from '../api/types';

export const localDoctors = doctorsJson as unknown as Doctor[];
