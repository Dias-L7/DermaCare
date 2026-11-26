import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { kk } from '../i18n/kk';
import { ru, type Dictionary } from '../i18n/ru';

export type Language = 'ru' | 'kk';

type LanguageValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Dictionary;
};

const dictionaries: Record<Language, Dictionary> = { ru, kk };

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const value = useMemo(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage нужно вызывать внутри LanguageProvider');
  }
  return value;
}
