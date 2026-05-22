'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { en, type TranslationKeys } from './en';
import { he } from './he';

export type Lang = 'en' | 'he';

const dict: Record<Lang, Record<TranslationKeys, string>> = { en, he };

interface LangCtx {
  lang: Lang;
  isRtl: boolean;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('appLang') as Lang | null;
    if (stored === 'en' || stored === 'he') setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('appLang', l);
  }, []);

  const t = useCallback(
    (key: TranslationKeys, vars?: Record<string, string | number>): string => {
      let str: string = dict[lang][key] ?? dict.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return str;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, isRtl: lang === 'he', setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LangCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
