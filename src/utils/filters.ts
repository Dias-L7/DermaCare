import type { Doctor } from '../api/types';

export function filterDoctors(
  doctors: Doctor[],
  query: string,
  onlyFavorites: boolean,
  favoriteIds: string[],
  specialtyLabels: Record<string, string>
) {
  const text = query.trim().toLowerCase();

  return doctors.filter((doctor) => {
    if (onlyFavorites && !favoriteIds.includes(doctor.id)) return false;
    if (!text) return true;
    const haystack = `${doctor.name} ${specialtyLabels[doctor.specialty] ?? ''}`.toLowerCase();
    return haystack.includes(text);
  });
}
