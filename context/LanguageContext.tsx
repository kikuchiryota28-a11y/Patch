'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dictionary, type Language, type Dictionary } from '@/lib/dictionary';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
  t: <K1 extends keyof Dictionary, K2 extends keyof Dictionary[K1]>(section: K1, key: K2) => Dictionary[K1][K2];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'patch-language';
const COOKIE_KEY = 'patch-locale';

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ja') return stored;
  const cookie = document.cookie.match(/(?:^|; )patch-locale=([^;]+)/)?.[1];
  if (cookie === 'en' || cookie === 'ja') return cookie;
  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    setLanguageState(readInitialLanguage());
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `${COOKIE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  const value = useMemo<LanguageContextValue>(() => {
    const active = dictionary[language];
    return {
      language,
      setLanguage,
      dictionary: active,
      t: (section, key) => active[section][key],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
