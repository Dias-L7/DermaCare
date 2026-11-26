import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SpecialtyKey } from '../i18n/types';

type FavoritesValue = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  favoriteServices: SpecialtyKey[];
  toggleService: (key: SpecialtyKey) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<SpecialtyKey[]>([]);

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite: (id: string) => setFavoriteIds((prev) => toggle(prev, id)),
      favoriteServices,
      toggleService: (key: SpecialtyKey) => setFavoriteServices((prev) => toggle(prev, key)),
    }),
    [favoriteIds, favoriteServices]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites нужно вызывать внутри FavoritesProvider');
  }
  return value;
}