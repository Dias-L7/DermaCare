import type { Doctor } from '../api/types';

export type SortMode = 'az' | 'rating' | 'favorites' | 'female' | 'male';

export const sortModes: SortMode[] = ['az', 'rating', 'favorites', 'female', 'male'];

export function isSortMode(value: unknown): value is SortMode {
    return typeof value === 'string' && (sortModes as string[]).includes(value);
}

export function sortDoctors(doctors: Doctor[], mode: SortMode, favoriteIds: string[]) {
    const byName = [...doctors].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    switch (mode) {
        case 'rating':
            return [...doctors].sort((a, b) => b.rating - a.rating);
        case 'favorites':
            return byName.filter((doctor) => favoriteIds.includes(doctor.id));
        case 'female':
            return byName.filter((doctor) => doctor.gender === 'female');
        case 'male':
            return byName.filter((doctor) => doctor.gender === 'male');
        default:
            return byName;
    }
}